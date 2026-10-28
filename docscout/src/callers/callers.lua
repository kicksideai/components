-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Every caller of the engine besides the Test tab: the extraction contract,
-- the Workflow Block and the agent tools. Each one runs the same engine under
-- the caller's identity.
local json = require("json")
local registry = require("registry")
local engine = require("engine")
local extractors = require("extractors")

local function invalid(message: string): error return errors.new({ kind = errors.INVALID, message = message }) end

-- Field values keyed by name, as Workflow data and agent answers use them.
local function values(result: any): any
    local out = {}
    for _, f in ipairs(result.fields) do if not f.missing then out[f.name] = f.value end end
    return out
end

local function verified(result: any): boolean
    for _, f in ipairs(result.fields) do if not f.verified then return false end end
    return true
end

local function contract_run(input: any): (any?, error?)
    if type(input) ~= "table" then return nil, invalid("Request must be an object") end
    local caller = input.caller or "agent"
    if caller ~= "agent" and caller ~= "workflow" and caller ~= "eval" then return nil, invalid("caller must be agent, workflow or eval") end
    return engine.run({ id = input.extractor_id, upload_id = input.upload_id, caller = caller })
end

local function block(request: any): (any?, error?)
    local config, input = request and request.config or {}, request and request.input or {}
    if type(config.extractor_id) ~= "string" or config.extractor_id == "" then return nil, invalid("Choose an extractor") end
    if type(input.upload_id) ~= "string" or input.upload_id == "" then return nil, invalid("The input needs an upload_id") end
    local result, err = engine.run({ id = config.extractor_id, upload_id = input.upload_id, caller = "workflow" })
    if err then return nil, err end
    return { values = values(result), fields = result.fields, verified = verified(result), run_id = result.run_id, pages = result.pages }, nil
end

local function tool_run(args: any): any
    local result, err = engine.run({ id = args.extractor_id, upload_id = args.upload_id, caller = "agent" })
    if err then return { success = false, error = tostring(err) } end
    local fields = {}
    for _, f in ipairs(result.fields) do
        local quote = f.evidence[1]
        fields[#fields + 1] = { name = f.name, value = f.value, found = not f.missing, verified = f.verified, confidence = f.confidence,
            quote = quote and quote.quote or nil, section = quote and quote.section or nil, page = quote and quote.page or nil }
    end
    return { success = true, run_id = result.run_id, verified = verified(result), fields = fields }
end

local function tool_list(args: any): any
    local listed, err = extractors.list()
    if err then return { success = false, error = tostring(err) } end
    local filter = type(args) == "table" and type(args.filter) == "string" and args.filter:lower() or ""
    local items = {}
    for _, row in ipairs(listed.items) do
        if filter ~= "" and not tostring(row.meta.title or ""):lower():find(filter, 1, true) then goto continue end
        items[#items + 1] = { extractor_id = row.component_id, title = row.meta.title, description = row.meta.description, fields = tonumber(row.meta.field_count) or 0 }
        ::continue::
    end
    return { success = true, extractors = items }
end

local function tool_get(args: any): any
    local snapshot, err = extractors.get(args.extractor_id)
    if err then return { success = false, error = tostring(err) } end
    if not snapshot.config then return { success = false, error = "Editing this extractor needs write access" } end
    local schema_entry, schema_err = registry.get("kickside.docscout:config_schema")
    if schema_err then return { success = false, error = tostring(schema_err) } end
    local schema = json.decode((schema_entry :: any).data.schema_json)
    return { success = true, title = snapshot.title, description = snapshot.description, expected_revision = snapshot.expected_revision,
        config = snapshot.config, config_schema = schema }
end

local function tool_configure(args: any): any
    local result, err = extractors.update(args.extractor_id, { title = args.title, description = args.description or "", config = args.config,
        expected_revision = args.expected_revision })
    if err then return { success = false, error = tostring(err) } end
    return { success = true, revision = result and result.context_revision }
end

return { contract_run = contract_run, block = block, tool_run = tool_run, tool_list = tool_list, tool_get = tool_get, tool_configure = tool_configure }
