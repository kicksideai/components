-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")

local M = {
    html = "kickside.mail.views:templates",
    text = "kickside.mail.views:text_templates",
    owner = "kickside.mail.library:projection",
    live_namespace = "kickside.mail.projection:",
    draft_namespace = "kickside.mail.draft:",
}

function M.name(resource: types.ResourceKey, face: string?): string
    local name = resource.kind .. "/" .. resource.name
    if face == "subject" then return name .. ".subject" end
    return name
end

function M.prefix(base: string): string
    return '{{ extends "/base/' .. base .. '" }}'
end

function M.entry(id: string, set: string, name: string, source: string): types.JetEntry
    return {id = id, kind = "template.jet", meta = {name = name, depends_on = {set}}, data = {set = set, source = source}}
end

function M.entries(resource: types.ResourceContent, namespace: string, html_set: string, text_set: string,
    ids: {[string]: string}?): {types.JetEntry}
    if resource.kind == "asset" then return {} end
    local prefix = resource.base and M.prefix(resource.base) or ""
    local id = namespace .. resource.kind .. "." .. resource.name
    local name = M.name(resource)
    local entries = {
        M.entry(ids and ids.html or id .. ".html", html_set, name, prefix .. resource.html),
        M.entry(ids and ids.text or id .. ".text", text_set, name, prefix .. resource.text),
    }
    if resource.subject then
        entries[#entries + 1] = M.entry(ids and ids.subject or id .. ".subject", text_set,
            M.name(resource, "subject"), resource.subject)
    end
    return entries
end

return M
