local security = require("security")
local component = require("component")
local agent_types = require("agent_types")
local component_types = require("component_types")

local function check(): boolean
    local actor = security.actor()
    if not actor then return false end
    local count, err = component.count({
        impl_ids = { agent_types.USER_AGENT_IMPL },
        meta = { [component_types.OWNER_META_KEY] = actor:id() },
    })
    if err then error("first-agent eligibility: " .. tostring(err)) end
    if count == nil then error("first-agent eligibility: count is unavailable") end
    return count == 0
end
return { check = check }
