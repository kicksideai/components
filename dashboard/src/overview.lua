-- GET /dashboard/overview — the deployment overview the dashboard renders.
--
-- Returns the installed navigable surfaces discovered from the registry, each
-- with a human description resolved from the entry meta and the owning module's
-- ns.definition. The SPA / web component renders this verbatim; it holds no
-- knowledge of which surfaces exist. The host router enforces auth — this handler
-- does no authentication of its own.

local http = require("http")
local registry = require("registry")
local discovery = require("discovery")
local dashboard_types = require("dashboard_types")

local function handler()
    local res = http.response()
    if not res then return nil, "no http context" end
    res:set_content_type(http.CONTENT.JSON)

    local surfaces = discovery.overview(registry, dashboard_types)
    res:set_status(http.STATUS.OK)
    res:write_json({
        success = true,
        surfaces = surfaces,
        count = #surfaces,
    })
end

return { handler = handler }
