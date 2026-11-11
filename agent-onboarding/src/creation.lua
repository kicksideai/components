-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local security = require("security")
local contract = require("contract")
local component = require("component")
local component_types = require("component_types")
local agents = require("agents")
local agent_types = require("agent_types")

local function new(dependencies: any?): any
    local contract = dependencies and dependencies.contract or contract
    local function create(input: any): (any?, error?)
        local actor = security.actor()
        if not actor then return nil, errors.new({kind=errors.PERMISSION_DENIED, message="authentication required"}) end
        if type(input) ~= "table" then return nil, errors.new({kind=errors.INVALID, message="input must be an object"}) end
        if input.memory ~= nil and type(input.memory) ~= "boolean" then
            return nil, errors.new({kind=errors.INVALID, message="memory must be a boolean"})
        end
        local args: any = {}
        for key, value in pairs(input) do if key ~= "memory" then args[key] = value end end
        if input.memory ~= false then
            local rows, query_err = component.query({
                impl_ids={"kickside.memory:memory_store"},
                meta={[component_types.OWNER_META_KEY]=actor:id()},
                order_by={field="created_at", direction="ASC"}, limit=1,
            })
            if query_err then return nil, query_err end
            local memory_id = rows and rows[1] and rows[1].component_id
            if not memory_id then
                local definition, definition_err = contract.get("kickside.knowledge:knowledge_bases")
                if definition_err then return nil, definition_err end
                local knowledge, open_err = definition:open()
                if open_err then return nil, open_err end
                local memory, memory_err = knowledge:create({name="My Memory", kb_type="memory", embedding_model="class:embed"})
                if memory_err then return nil, memory_err end
                memory_id = memory.component_id
            end
            local traits, contexts = {}, {}
            for _, trait in ipairs(args.traits or agent_types.default_traits()) do
                if trait ~= "kickside.memory:memory" then traits[#traits+1] = trait end
            end
            for trait, context in pairs(args.trait_contexts or {}) do contexts[trait] = context end
            traits[#traits+1] = "kickside.memory:memory"
            contexts["kickside.memory:memory"] = {memory_id=memory_id}
            args.traits, args.trait_contexts = traits, contexts
        end
        return agents.create(args)
    end
    return {create=create}
end
local default = new()
default.new = new
return default
