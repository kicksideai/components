local ctx = require("ctx")
local repo = require("research_repo")

-- kickside.contract:deletable.delete for the research-run component. A research run
-- is its thread (component_id == thread_id). This removes its run projections and
-- Block Signal correlations; Core owns thread events and component access/meta.
local function handle(request_dto): (any?, error?)
    local component_id = ctx.get("component_id")
    if type(component_id) ~= "string" or component_id == "" then
        return nil, errors.new({ kind = errors.INTERNAL, message = "no component context" })
    end
    local deleted, derr = repo.delete_by_thread(component_id)
    if derr then return nil, derr end
    return { success = true, deleted = deleted }
end

return { handle = handle }
