local test = require("test")
local discovery = require("discovery")
local dashboard_types = require("dashboard_types")

-- A stub registry returns canned entries per query, so the discovery logic is
-- exercised without the live registry. find() dispatches on the query's meta.type
-- (and on .kind for ns.definition).
local function stub_registry(nav_items, view_components, definitions)
    return {
        find = function(q)
            if q[".kind"] == dashboard_types.NS_DEFINITION_KIND then return definitions end
            if q["meta.type"] == dashboard_types.NAV_ITEM_TYPE then return nav_items end
            if q["meta.type"] == dashboard_types.VIEW_COMPONENT_TYPE then return view_components end
            return {}
        end,
    }
end

local function find_surface(surfaces, route_name)
    for _, s in ipairs(surfaces) do
        if s.route_name == route_name then return s end
    end
    return nil
end

local function define_tests()
    test.describe("KickSide Dashboard discovery", function()
        test.it("builds a card per declared nav item with its own comment", function()
            local reg = stub_registry(
                {
                    { id = "kickside.uploads:nav_item", meta = {
                        type = "ui.nav_item", title = "Uploads", icon = "tabler:files",
                        route_name = "uploads", order = 60, component_tag = "kickside-uploads",
                        comment = "Upload and convert files.",
                    } },
                },
                {}, {}
            )
            local surfaces = discovery.overview(reg, dashboard_types)
            test.eq(#surfaces, 1)
            local s = find_surface(surfaces, "uploads")
            test.not_nil(s)
            test.eq(s.label, "Uploads")
            test.eq(s.icon, "tabler:files")
            test.eq(s.component_tag, "kickside-uploads")
            test.eq(s.description, "Upload and convert files.")
        end)

        test.it("borrows the module ns.definition comment when the item has none", function()
            local reg = stub_registry(
                {
                    { id = "kickside.skills:nav_item", meta = {
                        type = "ui.nav_item", title = "Skills", route_name = "skills",
                        order = 62, component_tag = "kickside-skills",
                    } },
                },
                {},
                {
                    { id = "kickside.skills:definition", kind = "ns.definition", meta = {
                        title = "KickSide Skills",
                        comment = "Reusable agent procedures as versioned skills.",
                    } },
                }
            )
            local surfaces = discovery.overview(reg, dashboard_types)
            local s = find_surface(surfaces, "skills")
            test.not_nil(s)
            test.eq(s.description, "Reusable agent procedures as versioned skills.")
        end)

        test.it("resolves description from meta.comment", function()
            local reg = stub_registry(
                {
                    { id = "kickside.uploads:nav_item", meta = {
                        type = "ui.nav_item", title = "Uploads", route_name = "uploads",
                        order = 60, component_tag = "kickside-uploads",
                        comment = "Files your agents can read and process.",
                    } },
                },
                {}, {}
            )
            local surfaces = discovery.overview(reg, dashboard_types)
            local s = find_surface(surfaces, "uploads")
            test.not_nil(s)
            test.eq(s.description, "Files your agents can read and process.")
        end)

        test.it("borrows the matched view.component comment when the item has none", function()
            local reg = stub_registry(
                {
                    { id = "kickside.dm:nav_item", meta = {
                        type = "ui.nav_item", title = "Messages", route_name = "dm",
                        component_tag = "kickside-dm",
                    } },
                },
                {
                    { id = "kickside.dm:view", meta = {
                        type = "view.component", tag_name = "kickside-dm", icon = "tabler:message",
                        comment = "Direct messages with agents.",
                    } },
                },
                {}
            )
            local surfaces = discovery.overview(reg, dashboard_types)
            local s = find_surface(surfaces, "dm")
            test.not_nil(s)
            test.eq(s.description, "Direct messages with agents.")
            -- icon also borrowed from the view.component when the nav item omits one
            test.eq(s.icon, "tabler:message")
        end)

        test.it("omits private surfaces and sorts by order then label", function()
            local reg = stub_registry(
                {
                    { id = "m.b:nav", meta = { type = "ui.nav_item", title = "Beta", route_name = "b", order = 10 } },
                    { id = "m.a:nav", meta = { type = "ui.nav_item", title = "Alpha", route_name = "a", order = 10 } },
                    { id = "m.z:nav", meta = { type = "ui.nav_item", title = "Hidden", route_name = "z", private = true } },
                },
                {}, {}
            )
            local surfaces = discovery.overview(reg, dashboard_types)
            test.eq(#surfaces, 2)
            -- equal order -> alphabetical by title: Alpha before Beta
            test.eq(surfaces[1].route_name, "a")
            test.eq(surfaces[2].route_name, "b")
            test.eq(find_surface(surfaces, "z"), nil)
        end)

        test.it("falls back to the default icon and empty description gracefully", function()
            local reg = stub_registry(
                { { id = "m.x:nav", meta = { type = "ui.nav_item", title = "Bare", route_name = "x" } } },
                {}, {}
            )
            local surfaces = discovery.overview(reg, dashboard_types)
            local s = find_surface(surfaces, "x")
            test.not_nil(s)
            test.eq(s.icon, dashboard_types.DEFAULT_ICON)
            test.eq(s.description, "")
        end)

        test.it("returns an empty list when nothing is declared", function()
            local reg = stub_registry({}, {}, {})
            test.eq(#discovery.overview(reg, dashboard_types), 0)
        end)
    end)
end

local run_cases = test.run_cases(define_tests)
return { run = function(o) return run_cases(o) end }
