-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")
local registry = require("registry")
local error_envelope = require("error_envelope")
local render = require("render")
local vars_schema = require("vars")
local globals = require("globals")
local resource = require("resource")
local references = require("references")
local uuid = require("uuid")
local jet = require("jet")
local asset_refs = require("asset_refs")

local M = {}

local function closure(items: types.ResourceMap, message: types.ResourceContent?,
    candidates: {types.ResourceContent}, dependants: {types.Resource}?): {types.ResourceContent}
    local selected: {types.ResourceContent} = {}
    local seen: {[string]: boolean} = {}
    local function add(item: types.ResourceContent?)
        if not item then return end
        local id = resource.subject(item)
        if seen[id] then return end
        seen[id] = true
        selected[#selected + 1] = item
    end
    add(message)
    for _, item in ipairs(candidates) do add(item) end
    for _, item in ipairs(dependants or {}) do add(item) end
    for _, item in ipairs(selected) do
        for _, key in ipairs(references.template_keys(item)) do add(items[resource.subject(key)]) end
    end
    return selected
end

local function remove(overlay: registry.Snapshot, ids: {string}): (boolean?, error?)
    if #ids == 0 then return true, nil end
    local changes = overlay:changes()
    local _, stage_err = changes:delete(ids)
    if stage_err then return nil, stage_err end
    local _, apply_err = changes:apply()
    if apply_err then return nil, apply_err end
    return true, nil
end

local function clear_workspace(previews: {[string]: boolean}?): (boolean?, error?)
    local overlay, err = registry.overlay(jet.draft_owner)
    if err then return nil, err end
    local entries, list_err = overlay:entries()
    if list_err then return nil, list_err end
    local ids: {string} = {}
    for _, entry in ipairs(entries) do
        local boundary = entry.id:find(".", #jet.draft_namespace + 1, true)
        if not previews or (boundary and previews[entry.id:sub(1, boundary)]) then
            ids[#ids + 1] = entry.id
        end
    end
    return remove(overlay, ids)
end

function M.clear_workspace(): (boolean?, error?)
    return clear_workspace(nil)
end

function M.clear_expired(ids: {string}): (boolean?, error?)
    if #ids == 0 then return true, nil end
    local previews: {[string]: boolean} = {}
    for _, id in ipairs(ids) do previews[jet.scratch_namespace(id)] = true end
    return clear_workspace(previews)
end

local function open(selected: {types.ResourceContent}, checked: {types.ResourceContent},
    namespace: string, html_id: string, text_id: string): ({string}?, error?)
    local overlay, err = registry.overlay(jet.draft_owner)
    if err then return nil, err end
    local changes = overlay:changes()
    local _, html_err = changes:create({id = html_id, kind = "template.set", data = {engine = {escape = "html"}}})
    if html_err then return nil, html_err end
    local _, text_err = changes:create({id = text_id, kind = "template.set", data = {engine = {escape = "none"}}})
    if text_err then return nil, text_err end

    local ids: {string} = {html_id, text_id}
    local function stage(entry: types.JetEntry): error?
        local _, stage_err = changes:create(entry)
        if stage_err then return stage_err end
        ids[#ids + 1] = entry.id
        return nil
    end
    for _, item in ipairs(selected) do
        for _, entry in ipairs(jet.entries(item, namespace, html_id, text_id)) do
            local stage_err = stage(entry)
            if stage_err then return nil, stage_err end
        end
    end
    for _, item in ipairs(checked) do
        if item.kind == "part" then
            local name = "check/" .. item.name
            local source = '{{ include "/' .. jet.name(item) .. '" vars }}'
            local check_html_err = stage(jet.entry(namespace .. "check.html." .. item.name, html_id, name, source))
            if check_html_err then return nil, check_html_err end
            local check_text_err = stage(jet.entry(namespace .. "check.text." .. item.name, text_id, name, source))
            if check_text_err then return nil, check_text_err end
        end
    end
    local _, apply_err = changes:apply()
    if apply_err then return nil, apply_err end
    return ids, nil
end

local function with_draft<T>(id: string, selected: {types.ResourceContent}, checked: {types.ResourceContent},
    run: (types.TemplateSet, types.TemplateSet) -> (T?, error?)): (T?, error?)
    local namespace = jet.scratch_namespace(id)
    local html_id, text_id = namespace .. "html", namespace .. "text"
    local ids, open_err = open(selected, checked, namespace, html_id, text_id)
    if open_err then
        if open_err:kind() ~= errors.CONFLICT then return nil, open_err end
        return nil, error_envelope.wrap(open_err, "The draft workspace is unavailable.",
            {code = "mail_draft_workspace_unavailable"})
    end
    local value, err = render.with_sets(html_id, text_id, run)
    local final_err = error_envelope.cleanup(function()
        local overlay, overlay_err = registry.overlay(jet.draft_owner)
        if overlay_err then return nil, overlay_err end
        return remove(overlay, ids :: {string})
    end, err, "Cannot close the mail draft sets")
    if final_err then return nil, final_err end
    return value, nil
end

local function diagnostic_details(err: error): types.Record
    local details: types.Record = {}
    for key, value in pairs(err:details() or {}) do details[key] = value end
    details.cause = error_envelope.encode(err)
    return details
end

local function invalid(err: error): error
    return errors.new({kind = errors.INVALID, retryable = false, message = err:message(),
        details = diagnostic_details(err)})
end

local function diagnostic(err: error, item: types.ResourceContent, changed: {types.ResourceContent}): error
    local details = diagnostic_details(err)
    local candidates: {types.ResourceKey} = {}
    local seen: {[string]: boolean} = {}
    local function add(key: types.ResourceKey)
        local id = resource.subject(key)
        if seen[id] then return end
        seen[id] = true
        candidates[#candidates + 1] = {kind = key.kind, name = key.name}
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

local function validate_faces(item: types.ResourceContent, values: types.RenderGlobals, html: types.TemplateSet,
    text: types.TemplateSet): error?
    if item.kind == "message" then
        local _, err = render_message(item, item.samples, values, html, text)
        return err
    end
    local schema_err = vars_schema.validate_vars(item.schema, item.samples)
    if schema_err then return invalid(render.face_error(item, "samples", schema_err)) end
    local context = globals.context(values, item.samples, "")
    local name = item.kind == "part" and ("check/" .. item.name) or jet.name(item)
    context.assets = asset_refs.context(values.assets or {})
    local _, html_err = render.render_face(item, "html", html, name, context)
    if html_err then return invalid(html_err) end
    context.assets = nil
    local _, text_err = render.render_face(item, "text", text, name, context)
    if text_err then return invalid(text_err) end
    return nil
end

local function issue(err: error): types.DraftIssue
    local details = err:details()
    return {code = details.code :: string, message = err:message(), resource = details.resource :: types.ResourceKey,
        face = details.face :: string, engine_message = details.engine_message :: string?, candidate_resources = details.candidate_resources :: {types.ResourceKey}}
end

local function check(candidates: {types.ResourceContent}, dependants: {types.Resource}, values: types.RenderGlobals,
    html: types.TemplateSet, text: types.TemplateSet): (types.DraftPreview, error?, error?)
    local result: types.DraftPreview = {errors = {}, dependent_messages = {}}
    local candidate_error: error?
    local dependent_error: error?
    for _, candidate in ipairs(candidates) do
        local err = validate_faces(candidate, values, html, text)
        if err then
            err = diagnostic(err, candidate, candidates)
            result.errors[#result.errors + 1] = issue(err)
            candidate_error = candidate_error or err
        end
    end
    for _, item in ipairs(dependants) do
        local err = validate_faces(item, values, html, text)
        if err then
            err = diagnostic(err, item, candidates)
            result.errors[#result.errors + 1] = issue(err)
            result.dependent_messages[#result.dependent_messages + 1] = item.name
            dependent_error = dependent_error or err
        end
    end
    return result, candidate_error, dependent_error
end

function M.validate(items: types.ResourceMap, key: types.ResourceKey, candidates: {types.ResourceContent},
    dependants: {types.Resource}, values: types.RenderGlobals): (boolean?, error?)
    values.assets = asset_refs.from_items(items)
    local selected = closure(items, nil, candidates, dependants)
    return with_draft(uuid.v4(), selected, candidates, function(html: types.TemplateSet, text: types.TemplateSet): (boolean?, error?)
        local result, candidate_error, dependent_error = check(candidates, dependants, values, html, text)
        if candidate_error then return nil, candidate_error end
        if not dependent_error then return true, nil end
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

function M.preview(id: string, items: types.ResourceMap, item: types.Resource, vars: types.JsonObject, candidates: {types.ResourceContent},
    dependants: {types.Resource}, values: types.RenderGlobals, attachments: {types.AttachmentRef}?): (types.DraftPreview?, error?)
    values.assets = asset_refs.from_items(items)
    local selected = closure(items, item, candidates, dependants)
    return with_draft(id, selected, candidates, function(html: types.TemplateSet, text: types.TemplateSet): (types.DraftPreview?, error?)
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

function M.render(id: string, items: types.ResourceMap, item: types.Resource, vars: types.JsonObject,
    candidates: {types.ResourceContent}, values: types.RenderGlobals,
    attachments: {types.AttachmentRef}?): (types.Rendered?, error?)
    values.assets = asset_refs.from_items(items)
    local selected = closure(items, item, candidates)
    return with_draft(id, selected, {}, function(html: types.TemplateSet, text: types.TemplateSet): (types.Rendered?, error?)
        local result, err = render_message(item, vars, values, html, text, attachments)
        if err then return nil, diagnostic(err, item, candidates) end
        return result, nil
    end)
end

return M
