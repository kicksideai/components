-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Registry conformance forces every contract addition to choose its agent role.
local registry = require("registry")
local security = require("security")
local json = require("json")
local test = require("test")
local consts = require("consts")
local requests = require("requests")
local M = {}
type Map = { [string]: unknown }

local exclusions = {
    ["kickside.pim:catalog.get_catalog"] = "Settings resolves one exact catalog; PIMCatalogs already exposes its summary to agents.",
    ["kickside.pim:catalog.plugin_feed"] = "State workers consume opaque feed tokens through the host contract only.",
    ["kickside.pim:catalog.plugin_context"] = "Plugin service admission uses the host contract only.",
    ["kickside.pim:schema_provider.resolve"] = "Provider seam resolves plugin schema declarations.",
    ["kickside.pim:family_check.run"] = "Family checks run inside catalog commands, readiness and release.",
    ["kickside.pim:link_target.resolve"] = "Provider seam resolves link targets.",
    ["kickside.pim:link_target.describe"] = "Provider seam describes link targets.",
    ["kickside.pim.inventory:inventory.attach"] = "Administration owns attachment setup.",
    ["kickside.pim.inventory:inventory.upsert_location"] = "Administration owns location configuration.",
    ["kickside.pim.inventory:inventory.sweep"] = "Maintenance expires holds.",
    ["kickside.pim.inventory:inventory.sync"] = "Maintenance advances the products cursor.",
    ["kickside.pim.knowledge:knowledge.status"] = "Provider status describes indexing state.",
}
local contracts = {
    ["kickside.pim:catalog"] = { namespace = "kickside.pim.traits", policy = "kickside.pim.security:tool_access" },
    ["kickside.pim.inventory:inventory"] = { namespace = "kickside.pim.inventory.traits", policy = "kickside.pim.inventory.security:tool_access" },
    ["kickside.pim.knowledge:knowledge"] = { namespace = "kickside.pim.knowledge", policy = "kickside.pim.knowledge.security:tool_access" },
}

local function equal(a: unknown, b: unknown, path: string)
    test.eq(type(a), type(b), path)
    if type(a) ~= "table" or type(b) ~= "table" then test.eq(a, b, path); return end
    for key, value in pairs(a :: Map) do equal(value, (b :: Map)[key], path .. "." .. tostring(key)) end
    for key in pairs(b :: Map) do test.not_nil((a :: Map)[key], path .. "." .. tostring(key)) end
end
M.equal = equal

local function described(schema: Map, path: string, nested: boolean)
    for key, value in pairs(schema.properties or {}) do
        local property = value :: Map
        local description = property.description
        test.is_true(type(description) == "string" and description:match("%S") ~= nil, path .. "." .. key .. " description")
        test.is_true(type(description) == "string" and #description <= 200, path .. "." .. key .. " description length")
        if nested then described(property, path .. "." .. key, true) end
    end
    if not nested then return end
    for key, value in pairs(schema) do
        if key ~= "properties" and type(value) == "table" then
            described(value :: Map, path .. "." .. key, true)
        end
    end
end

function M.enum(schema: Map, expected: Map, path: string)
    local actual: Map = {}
    for _, value in ipairs(schema.enum or {}) do
        test.is_nil(actual[value], path .. " unique enum values")
        actual[value] = true
    end
    equal(actual, expected, path .. " enum values")
end

local function declarations(method: string, schema: Map)
    local properties = schema.properties
    if method == "apply" or method == "propose" then
        local status = properties.items.items.properties.status :: Map
        test.is_nil(status.type, method .. " status is judged per item")
        test.is_nil(status.enum, method .. " status is judged per item")
        local named: Map = {}
        for value in (status.description :: string):match("Accepted values: ([^.]+)%."):gmatch("[%w_]+") do named[value] = true end
        equal(named, consts.STATUSES, method .. " described product statuses")
    end
    if method == "query" then
        M.enum(properties.status :: Map, consts.STATUSES, "query product status")
        test.is_nil(requests.parse("query", { where = { ["and"] = {
            { field = "core.name", op = "contains", value = "name" },
            { ["not"] = { field = "core.name", op = "is_null", value = true } },
        } } }), "recursive filter declarations validate after contract normalization")
    end
    if method == "release" or method == "withdraw" or method == "propose" then
        local valid = json.validate(schema, { items = { {} } })
        test.is_false(valid, method .. " requires each product reference")
    end
    if method == "release" then
        local valid = json.validate(schema, { items = { { product = { sku = "example" } } } })
        test.is_true(valid, "release judges missing versions per item")
        test.is_nil(properties.items.items.properties.expect_version.type, "release judges malformed versions per item")
    end
    if method == "get" then
        test.is_false(json.validate(schema, { product = {} }), "a product reference requires id or sku")
    end
    if method == "apply" then
        local valid = json.validate(schema, { items = { { product = { sku = "example" }, set = { { attr = "core.name" } } } } })
        test.is_true(valid, "apply judges missing authored values per item")
    end
    if method == "propose" then
        local item = properties.items.items
        for _, key in ipairs({ "create", "upsert", "move", "delete", "restore", "term", "term_merge" }) do
            test.is_nil(item.properties[key], "proposals expose value and status edits only: " .. key)
        end
    end
end

function M.check(inventory_states: Map?)
    local declared: { [string]: boolean } = {}
    for _, trait in ipairs(assert(registry.find({ ["meta.type"] = "agent.trait" }))) do
        if tostring(trait.id):match("^kickside%.pim%.") then
            for _, id in ipairs(trait.data.tools or {}) do declared[id] = true end
        end
    end
    for _, plugin in ipairs(assert(registry.find({ ["meta.type"] = "kickside.pim.plugin" }))) do
        for _, id in ipairs(plugin.meta.tools or {}) do declared[id] = true end
    end
    local aliases: { [string]: string } = {}
    local tool_text: { string } = {}
    local covered: { [string]: boolean } = {}
    local by_contract: { [string]: Map } = {}
    for _, entry in ipairs(assert(registry.find({ ["meta.type"] = "tool" }))) do
        local id = tostring(entry.id)
        if id:match("^kickside%.pim[%.:]") then
            test.is_true(declared[id] == true, id .. " is declared by a trait or plugin")
            local meta = entry.meta
            test.eq(meta.type, "tool", id)
            test.is_true(type(meta.title) == "string" and #meta.title > 0, id)
            test.is_true(type(meta.llm_alias) == "string" and meta.llm_alias:match("^[A-Z][A-Za-z0-9]+$") ~= nil, id)
            test.is_nil(aliases[meta.llm_alias], id .. " alias is unique")
            aliases[meta.llm_alias] = id
            test.is_true(type(meta.llm_description) == "string" and #meta.llm_description > 40, id)
            local scopes = meta.mcp.required_scopes
            test.eq(#scopes, 1, id)
            test.is_true(scopes[1] == "state.read" or scopes[1] == "state.write", id)
            local sentences = 0
            for _ in meta.llm_description:gmatch("[^.!?]+[.!?]") do sentences = sentences + 1 end
            test.eq(sentences, 2, id .. " two description sentences")
            tool_text[#tool_text + 1] = meta.llm_description .. " " .. meta.input_schema .. " " .. meta.output_schema
            local input = assert(json.decode(meta.input_schema))
            local output = assert(json.decode(meta.output_schema))
            test.eq(output.type, "object", id)
            described(input, id .. " input", true)
            described(output, id .. " output", false)
            local matched = false
            for contract_id, config in pairs(contracts) do
                if id:match("^" .. config.namespace:gsub("%.", "%%.") .. ":") then
                    local method = entry.data.method
                    if method == "list_catalogs" then method = "list" end
                    if method == "create_catalog" then method = "create" end
                    local definition = assert(registry.get(contract_id))
                    for _, m in ipairs(definition.data.methods) do
                        if m.name == method then
                            equal(input, assert(json.decode(m.input_schemas[1].definition)), id .. " input schema")
                            if contract_id == "kickside.pim:catalog" then declarations(method, input) end
                            if contract_id == "kickside.pim.inventory:inventory" then
                                if input.properties.product then
                                    test.is_false(json.validate(input.properties.product, {}), id .. " product requires id or sku")
                                end
                                if input.properties.location then
                                    test.is_false(json.validate(input.properties.location, {}), id .. " location requires id or code")
                                end
                                if method == "get_stock" or method == "get_reservation" or method == "commit" or method == "release" then
                                    test.is_false(json.validate(input, { catalog_id = "catalog" }), id .. " requires its lookup identity")
                                end
                            end
                            if contract_id == "kickside.pim.inventory:inventory" and method == "list_reservations" then
                                M.enum(input.properties.state :: Map, assert(inventory_states), id .. " reservation states")
                            end
                            local contract_output = assert(json.decode(m.output_schemas[1].definition))
                            described(contract_output, id .. " contract output", false)
                            if contract_id == "kickside.pim.knowledge:knowledge" and method == "search" then
                                test.is_nil(contract_output.properties.answer, id .. " search returns hits without synthesized answers")
                            end
                            contract_output.properties.success = { type = "boolean", const = true,
                                description = "True when the contract call completes successfully." }
                            contract_output.required = contract_output.required or {}
                            table.insert(contract_output.required, "success")
                            equal(output, contract_output, id .. " output schema plus tool success")
                            local key = contract_id .. "." .. method
                            test.is_nil(exclusions[key], key .. " is not excluded")
                            test.is_nil(covered[key], key .. " has one tool")
                            covered[key], matched = true, true
                            by_contract[contract_id] = by_contract[contract_id] or {}
                            by_contract[contract_id][id] = true
                        end
                    end
                end
            end
            test.is_true(matched, id .. " maps to a contract method")
        end
    end
    for _, description in ipairs(tool_text) do
        for alias in description:gmatch("PIM[A-Z][A-Za-z0-9]+") do
            test.not_nil(aliases[alias], alias .. " names a declared tool")
        end
    end
    for _, definition in ipairs(assert(registry.find({ [".kind"] = "contract.definition" }))) do
        local id = tostring(definition.id)
        if id:match("^kickside%.pim[%.:]") then
            for _, method in ipairs(definition.data.methods) do
                local key = id .. "." .. method.name
                test.is_true(covered[key] == true or type(exclusions[key]) == "string", key .. " needs a coverage decision")
            end
        end
    end
    for contract_id, ids in pairs(by_contract) do
        local policy = assert(registry.get(contracts[contract_id].policy))
        local resources: Map = {}
        for _, id in ipairs(policy.data.policy.resources) do
            test.is_nil(resources[id], id .. " appears once in policy")
            resources[id] = true
        end
        local expected: Map = {}
        for id in pairs(ids) do expected[id] = true end
        if contract_id == "kickside.pim:catalog" then
            for _, name in ipairs({ "pim_readonly", "pim_trait", "pim_admin", "build", "build_reads" }) do
                expected["kickside.pim.traits:" .. name] = true
            end
        end
        equal(expected, resources, contract_id .. " exact tool and trait policy")
        local namespace = contracts[contract_id].policy:match("^(.-):")
        local baseline = { assert(security.policy(namespace .. ":module_access")) }
        local runtime = contract_id == "kickside.pim.knowledge:knowledge" and "knowledge_access" or "module_runtime"
        baseline[#baseline + 1] = assert(security.policy(namespace .. ":" .. runtime))
        local scope = assert(security.new_scope(baseline))
        local permitted = scope:with(assert(security.policy(contracts[contract_id].policy)))
        for id in pairs(expected) do
            for _, action in ipairs({ "registry.get", "registry.find", "funcs.call" }) do
                test.is_true(scope:evaluate(security.actor(), action, id) ~= "allow", id .. " requires tool_access for " .. action)
                test.eq(permitted:evaluate(security.actor(), action, id), "allow", id .. " admits tool_access for " .. action)
            end
        end
    end
end
return M
