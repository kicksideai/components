-- Dashboard discovery: build the deployment overview from the registry.
--
-- The overview is the set of installed navigable surfaces. A surface is declared
-- as a ui.nav_item registry entry; a view.component entry (matched by its tag)
-- enriches the surface with an icon/comment when the nav item omits one. The
-- human description for a card is resolved in priority order: the entry's own
-- meta comment, the matched view.component's comment, then the owning module's
-- ns.definition comment — so every card carries a real
-- sentence rather than placeholder text.
--
-- Pure over an injected registry table (the live `registry` module, or a stub in
-- tests), so the discovery logic is exercised without the live registry.

local M = {}

type Surface = {
    id: string,
    label: string,
    description: string,
    icon: string,
    route_name: string,
    component_tag: string,
}

type Entry = { id: string?, kind: string?, meta: { [string]: any }? }

-- module_ns extracts the owning module namespace from an entry id (the part
-- before the final ":"). "kickside.uploads:uploads_view" → "kickside.uploads".
local function module_ns(id: string): string
    local ns = string.match(id, "^(.+):[^:]+$")
    return ns or id
end

-- first_text returns the first non-empty string among its arguments. It walks
-- the varargs with select so a nil argument ahead of a present meta.comment does
-- not truncate the scan.
local function first_text(...): string
    local n = select("#", ...)
    for i = 1, n do
        local v = select(i, ...)
        if type(v) == "string" and v ~= "" then return v :: string end
    end
    return ""
end

-- module_descriptions maps each module namespace to its ns.definition comment
-- (falling back to the definition title), so a surface with
-- no description of its own borrows its module's sentence.
local function module_descriptions(reg: any, dashboard_types: any): { [string]: string }
    local out: { [string]: string } = {}
    local entries = reg.find({ [".kind"] = dashboard_types.NS_DEFINITION_KIND })
    if type(entries) ~= "table" then return out end
    for _, raw in ipairs(entries :: { Entry }) do
        local e = raw :: Entry
        local id = e.id or ""
        local meta = e.meta or {}
        if id ~= "" then
            out[module_ns(id)] = first_text(meta.comment, meta.title)
        end
    end
    return out
end

-- view_components maps a component tag to its view.component meta, so a nav item
-- rendered as a component can borrow the component's icon/comment.
local function view_components(reg: any, dashboard_types: any): { [string]: { [string]: any } }
    local out: { [string]: { [string]: any } } = {}
    local entries = reg.find({
        [".kind"] = "registry.entry",
        ["meta.type"] = dashboard_types.VIEW_COMPONENT_TYPE,
    })
    if type(entries) ~= "table" then return out end
    for _, raw in ipairs(entries :: { Entry }) do
        local e = raw :: Entry
        local meta = e.meta or {}
        local tag = meta.tag_name or meta.component_tag
        if type(tag) == "string" and tag ~= "" then out[tag :: string] = meta end
    end
    return out
end

-- overview returns the installed surfaces, each with a resolved description.
-- Surfaces flagged meta.private are omitted (internal surfaces). The result is
-- sorted by declared order then label, so the grid is stable.
function M.overview(reg: any, dashboard_types: any): { Surface }
    local mod_desc = module_descriptions(reg, dashboard_types)
    local views = view_components(reg, dashboard_types)

    local entries = reg.find({
        [".kind"] = "registry.entry",
        ["meta.type"] = dashboard_types.NAV_ITEM_TYPE,
    })
    local surfaces: { Surface } = {}
    if type(entries) ~= "table" then return surfaces end

    -- The nav module ranks by order; mirror that so the dashboard grid lists
    -- surfaces in the same sequence the user sees in navigation.
    local ordered: { { entry: Entry, order: number } } = {}
    for _, raw in ipairs(entries :: { Entry }) do
        local e = raw :: Entry
        local meta = e.meta or {}
        -- Skip internal surfaces and the home surface itself: the overview is the
        -- home, so it does not list a card linking back to itself.
        if not meta.private and meta.path ~= dashboard_types.HOME_PATH then
            ordered[#ordered + 1] = { entry = e, order = tonumber(meta.order) or dashboard_types.DEFAULT_ORDER }
        end
    end
    table.sort(ordered, function(a, b): boolean
        if a.order == b.order then
            local la = ((a.entry.meta or {}).title or "") :: string
            local lb = ((b.entry.meta or {}).title or "") :: string
            return la < lb
        end
        return a.order < b.order
    end)

    for _, item in ipairs(ordered) do
        local e = item.entry
        local meta = e.meta or {}
        local id = e.id or ""
        local tag = (type(meta.component_tag) == "string") and (meta.component_tag :: string) or ""
        local view = (tag ~= "") and views[tag] or nil

        local description = first_text(
            meta.comment,
            view and view.comment,
            mod_desc[module_ns(id)]
        )

        surfaces[#surfaces + 1] = {
            id = id,
            label = first_text(meta.title, view and view.title),
            description = description,
            icon = first_text(meta.icon, view and view.icon, dashboard_types.DEFAULT_ICON),
            route_name = (type(meta.route_name) == "string") and (meta.route_name :: string) or "",
            component_tag = tag,
        }
    end

    return surfaces
end

return M
