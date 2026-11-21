-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry_values = require("registry_values")
-- Pure plugin seams retain the ambient caller and return bounded concrete results.
local funcs = require("funcs")
local channel = require("channel")
local time = require("time")
local registry = require("registry")
local security = require("security")
local plugins = require("plugins")
local fields = require("fields")
local values = require("values")
local types = require("types")
local rules = require("rules")
local M = {}
local MAX_RESULT_BYTES = 65536

local function invoke(id: string, request: types.GuardRequest | types.OperandRequest): (unknown, error?)
    local future, err = funcs.async(id, request)
    if err or not future then return nil, err end
    local timer = time.timer("1s")
    local deadline = timer:channel()
    local selected = channel.select({ future:response():case_receive(), deadline:case_receive() })
    if selected.channel == deadline then
        future:cancel()
        return nil, errors.new({ kind = errors.TIMEOUT, message = "plugin hook exceeded its execution limit",
            details = { code = "plugin_hook_timeout", hook = id } })
    end
    timer:stop()
    local payload, failure = future:result()
    if failure or not payload then return nil, failure end
    return payload:data()
end

local function invalid(code: string, message: string): error
    return errors.new({ kind = errors.INVALID, message = message, details = { code = code } })
end

local function load(id: string, kind: string, active: { types.PluginDecl }?): (types.JsonObject?, error?)
    local err = plugins.seam(id, active)
    if err then return nil, err end
    local entry, rerr = registry.get(id)
    if rerr then return nil, rerr end
    if not entry or (entry.meta or {}).type ~= "kickside.work." .. kind then return nil, invalid("plugin_seam_invalid", id .. " is not a " .. kind) end
    return registry_values.canonical(entry.meta) :: types.JsonObject, nil
end

function M.validate(compiled: types.Compiled): error?
    for _, process in ipairs(compiled.processes) do
        local function check(ids: { string }?): error?
            for _, id in ipairs(ids or {}) do
                local meta, err = load(id, "guard", compiled.plugins)
                if err or not meta then return err end
                for _, code in ipairs((meta.reads or {}) :: { string }) do
                    local found = false
                    for _, f in ipairs(compiled.fields) do if f.code == code then found = true end end
                    if not found then return invalid("guard_field_unknown", "guard reads unknown field " .. code) end
                end
            end
            return nil
        end
        for _, state in ipairs(process.states) do
            local err = check(state.invariants)
            if err then return err end
        end
        for _, transition in ipairs(process.transitions) do
            local err = check(transition.guards)
            if err then return err end
        end
    end
    return nil
end

local function actor(board: types.Board?): types.HookActor
    local current = security.actor()
    local groups: { string } = {}
    for id in pairs(board and board.caller and board.caller.groups or {}) do groups[#groups + 1] = id end
    table.sort(groups)
    return { id = current and current:id(), groups = groups }
end

local function invalid_guard(message: string): error
    return errors.new({ kind = errors.UNAVAILABLE, message = message, details = { code = "guard_result_invalid" } })
end

local function guard_result(answer: unknown): (types.GuardResult?, error?)
    if type(answer) ~= "table" or type(answer.allow) ~= "boolean" or type(answer.findings) ~= "table" or #answer.findings > 64 then
        return nil, invalid_guard("guard returns allow and bounded findings")
    end
    local bytes = 0
    for key, finding in pairs(answer.findings) do
        if type(key) ~= "number" or math.tointeger(key) == nil or key < 1 or key > #answer.findings then
            return nil, invalid_guard("guard findings are a list")
        end
        if type(finding) ~= "table" or type(finding.code) ~= "string" or type(finding.message) ~= "string"
            or (finding.field ~= nil and type(finding.field) ~= "string") then
            return nil, invalid_guard("guard finding requires code and message and may name a field")
        end
        for name in pairs(finding) do
            if name ~= "code" and name ~= "message" and name ~= "field" then
                return nil, invalid_guard("guard finding contains an unknown property")
            end
        end
        bytes = bytes + #finding.code + #finding.message + #(finding.field or "")
        if bytes > MAX_RESULT_BYTES then return nil, invalid_guard("guard findings hold at most 64 KB") end
    end
    if #values.canonical(answer.findings) > MAX_RESULT_BYTES then
        return nil, invalid_guard("guard findings hold at most 64 KB")
    end
    return answer :: types.GuardResult, nil
end

function M.guard(board: types.Board, item: types.Item, transition: types.Transition?, ids: { string }?): (boolean, { types.Finding }?, error?)
    if #(ids or {}) > 0 and board.caller_error then return false, nil, board.caller_error end
    for _, id in ipairs(ids or {}) do
        local meta, err = load(id, "guard", board.compiled.plugins)
        if err or not meta then return false, nil, err end
        local held: types.JsonObject = {}
        for _, code in ipairs((meta.reads or {}) :: { string }) do
            local field = board.model.fields[code]
            if not field then return false, nil, invalid("guard_field_unknown", "guard reads unknown field " .. code) end
            if not rules.field(board, field, "read", item.document) then return false, nil, rules.denied(code) end
            local value = fields.value(field, item)
            if value ~= nil then
                local surface, serr = fields.surface(field, value)
                if serr then return false, nil, serr end
                held[field.code] = surface
            end
        end
        local request: types.GuardRequest = { config = {}, item = { id = item.item_id, type = item.type, state = item.state,
            category = item.category, parent = item.parent_id, rank = item.rank, values = held }, transition = transition, actor = actor(board) }
        local answer, aerr = invoke(id, request)
        if aerr then return false, nil, errors.wrap(aerr, "guard " .. id .. " unavailable") end
        local result, rerr = guard_result(answer)
        if rerr or not result then return false, nil, rerr end
        if not result.allow then return false, result.findings, nil end
    end
    return true, {}, nil
end

function M.operand(reader: types.Reader, raw: unknown): (types.OperandResult?, error?)
    if type(raw) ~= "table" or type(raw.id) ~= "string" then return nil, invalid("invalid_operand", "$operand names an id and optional config") end
    for key in pairs(raw) do if key ~= "id" and key ~= "config" then return nil, invalid("invalid_operand", "unknown operand key") end end
    if raw.config ~= nil and type(raw.config) ~= "table" then return nil, invalid("invalid_operand", "operand config is an object") end
    local meta, err = load(raw.id, "operand", reader.plugins)
    if err or not meta then return nil, err end
    local request: types.OperandRequest = { board_id = reader.board_id, config = raw.config or {}, actor = actor(nil) }
    local answer, aerr = invoke(raw.id, request)
    if aerr then return nil, errors.wrap(aerr, "operand unavailable") end
    local remaining = 4096
    local active: { [table]: boolean } = {}
    local concrete: (unknown, integer) -> error?
    function concrete(value: unknown, depth: integer): error?
        remaining = remaining - 1
        if remaining < 0 or depth > 16 then return invalid("operand_result_invalid", "operand result exceeds its structural bound") end
        local kind = type(value)
        if kind == "number" then
            if value ~= value or value == math.huge or value == -math.huge then return invalid("operand_result_invalid", "operand numbers are finite") end
        elseif kind == "table" then
            local object = value :: table
            if active[object] then return invalid("operand_result_invalid", "operand results are acyclic") end
            active[object] = true
            local members, numeric = 0, false
            for key, member in pairs(value :: { [unknown]: unknown }) do
                members = members + 1
                if type(key) == "string" then
                    if key:sub(1, 1) == "$" then return invalid("operand_result_invalid", "operand returns concrete values") end
                elseif type(key) == "number" and math.tointeger(key) ~= nil and key >= 1 and key <= #object then numeric = true
                else return invalid("operand_result_invalid", "operand results are JSON values") end
                local err = concrete(member, depth + 1)
                if err then return err end
            end
            if members > 1000 or (numeric and members ~= #object) then return invalid("operand_result_invalid", "operand collections hold at most 1000 members") end
            active[object] = nil
        elseif kind ~= "string" and kind ~= "boolean" then return invalid("operand_result_invalid", "operand returns a concrete value") end
        return nil
    end
    local result_err = concrete(answer, 1)
    if result_err then return nil, result_err end
    if #values.canonical(answer) > MAX_RESULT_BYTES then return nil, invalid("operand_result_invalid", "operand result holds at most 64 KB") end
    return answer :: types.OperandResult, nil
end
return M
