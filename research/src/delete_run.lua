local ctx = require("ctx")
local repo = require("research_repo")

-- kickside.contract:deletable.delete for the research-run component. A research run
-- IS its thread (component_id == thread_id), so deleting the component tears down its
-- read-model row(s) here, keeping kickside_research_run in sync on delete the same way
-- the projection keeps it in sync on append. The thread events + component access/meta
-- are torn down by the thread/component delete path; this owns only research's table.
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
