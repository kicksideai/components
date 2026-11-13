-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Caller authority resolves the live directory memberships for each operation.
local security = require("security")
local funcs = require("funcs")
local contract = require("contract")
local component = require("component")
local identity = require("identity")
local rules = require("rules")
local domain = require("domain")
local types = require("types")
local approvals = require("approvals")
local clock = require("clock")
local M = {}

local function unavailable(message: string): error
    return errors.new({ kind = errors.UNAVAILABLE, retryable = false, message = message, details = { code = "contract_unavailable" } })
end

local function groups_of(id: string): ({ string }?, boolean, error?)
    local definition, err = contract.get("kickside.contract:directory")
    if err then return nil, false, errors.wrap(err, "principal directory cannot resolve") end
    if not definition then return nil, false, unavailable("principal directory is unavailable") end
    local directory, oerr = definition:open()
    if oerr then return nil, false, errors.wrap(oerr, "principal directory cannot open") end
    if not directory then return nil, false, unavailable("principal directory cannot open") end
    local answer, gerr = directory:groups({ id = id })
    if gerr then return nil, false, errors.wrap(gerr :: error, "live groups cannot resolve") end
    if type(answer) ~= "table" then return nil, false, unavailable("live groups cannot resolve") end
    local result = answer :: { active: boolean?, groups: { unknown }? }
    if type(result.groups) ~= "table" then return nil, false, unavailable("live groups are malformed") end
    if #result.groups > rules.MAX_GROUPS then return nil, false, unavailable("live groups exceed the cap of 100") end
    local groups: { string } = {}
    for _, group in ipairs(result.groups) do
        if type(group) ~= "string" or group == "" then return nil, false, unavailable("live group is malformed") end
        groups[#groups + 1] = group
    end
    return groups, result.active == true, nil
end

function M.resolve_memberships(input: { principals: { string }, deadline: domain.Deadline? }): (domain.Memberships?, error?)
    local out: domain.Memberships = {}
    for _, key in ipairs(input.principals) do
        if input.deadline and clock.passed(input.deadline) then
            return nil, errors.new({ kind = errors.TIMEOUT, message = "membership resolution deadline passed", details = { code = "membership_deadline" } })
        end
        local kind, id = key:match("^principal:([^:]+):(.+)$")
        local groups: { [string]: boolean } = {}
        if kind == "user" then
            local live, active, err = groups_of(id :: string)
            if err then return nil, err end
            if active then for _, group in ipairs(live or {}) do groups[group] = true end end
        elseif kind == "group" then groups[id :: string] = true end
        out[key] = groups
    end
    return out, nil
end

function M.resolve_principal(input: unknown): (types.PrincipalResult?, error?)
    if type(input) ~= "table" or type((input :: { [string]: unknown }).groups) ~= "table" then return nil, unavailable("holder groups are required") end
    local groups = (input :: { groups: { unknown } }).groups
    for _, id in ipairs(groups) do
        if type(id) ~= "string" or id == "" then return nil, unavailable("holder group is malformed") end
        local group, err = security.named_scope(id)
        if err or not group then return nil, unavailable("holder group " .. id .. " cannot resolve") end
    end
    if (input :: { validate_only: boolean? }).validate_only == true then return true, nil end
    local actor = security.actor()
    if not actor then return nil, unavailable("caller principal is unavailable") end
    local principal, perr = identity.principal_of_key(actor:id())
    if perr or not principal then return nil, unavailable("caller principal cannot resolve") end
    local caller: domain.AccessCaller = { principal = principal :: domain.PrincipalDecl, groups = {}, admin = false }
    if principal.kind == "group" then caller.groups[principal.id] = true end
    if principal.kind == "user" then
        local groups, active, err = groups_of(caller.principal.id)
        if err then return nil, err end
        if not active then return nil, unavailable("caller has no active principal") end
        for _, group in ipairs(groups or {}) do caller.groups[group] = true end
    end
    return caller, nil
end

function M.for_board(board_id: string, compiled: domain.Compiled, context: types.ReadContext?, approval_groups: { string }?): (domain.AccessCaller?, error?)
    local groups: { string } = {}
    local seen: { [string]: boolean } = {}
    local function collect(holders: { domain.Holder }?)
        for _, holder in ipairs(holders or {}) do
            if holder.group and not seen[holder.group] then groups[#groups + 1] = holder.group; seen[holder.group] = true end
        end
    end
    for _, id in ipairs(approval_groups or {}) do
        if not seen[id] then groups[#groups + 1] = id; seen[id] = true end
    end
    for _, process in ipairs(compiled.processes) do
        for _, state in ipairs(process.states) do
            local rule = approvals.rule(state)
            for _, id in ipairs(rule and approvals.groups(rule) or {}) do
                if not seen[id] then groups[#groups + 1] = id; seen[id] = true end
            end
        end
    end
    for _, level in ipairs(compiled.visibility and compiled.visibility.levels or {}) do collect(level.holders) end
    for _, field in ipairs(compiled.fields) do
        if field.access then collect(field.access.read); collect(field.access.write) end
    end
    local caller = context and context.caller
    if caller then
        local unchecked: { string } = {}
        for _, id in ipairs(groups) do
            if not context.holders[id] then unchecked[#unchecked + 1] = id end
        end
        if #unchecked > 0 then
            local checked, err = funcs.call("kickside.work.read:resolve_principal", { groups = unchecked, validate_only = true })
            if err then return nil, err end
            if checked ~= true then return nil, unavailable("holder groups cannot resolve") end
            for _, id in ipairs(unchecked) do context.holders[id] = true end
        end
    else
        local result, err = funcs.call("kickside.work.read:resolve_principal", { groups = groups })
        if err then return nil, err end
        if type(result) ~= "table" then return nil, unavailable("caller authority is unavailable") end
        caller = result :: domain.AccessCaller
        if context then
            context.caller = caller
            for _, id in ipairs(groups) do context.holders[id] = true end
        end
    end
    caller = { principal = caller.principal, groups = caller.groups, admin = false }
    local _, aerr = component.validate_access(board_id, component.ACCESS.ADMIN :: integer)
    if aerr and aerr:kind() ~= errors.PERMISSION_DENIED then return nil, errors.wrap(aerr :: error, "board ADMIN cannot resolve") end
    if not aerr then
        local groups: { string } = {}
        for id in pairs(caller.groups) do groups[#groups + 1] = id end
        local allowed, lerr = component.validate_principal_access(board_id, component.ACCESS.ADMIN :: integer, caller.principal, groups, nil)
        if lerr then return nil, errors.wrap(lerr :: error, "live board ADMIN cannot resolve") end
        caller.admin = allowed
    end
    return caller, nil
end

function M.resolve(board: domain.Board, context: types.ReadContext?, approval_groups: { string }?): error?
    local needed = board.compiled.visibility ~= nil or #(approval_groups or {}) > 0
    for _, field in ipairs(board.compiled.fields) do needed = needed or field.access ~= nil end
    for _, process in ipairs(board.compiled.processes) do
        needed = needed or process.migration == "pin"
        for _, state in ipairs(process.states) do
            local rule = approvals.rule(state)
            needed = needed or #(state.invariants or {}) > 0 or rule ~= nil
        end
        for _, transition in ipairs(process.transitions) do needed = needed or #(transition.guards or {}) > 0 end
    end
    if not needed then return nil end
    local caller, err = M.for_board(board.board_id, board.compiled, context, approval_groups)
    if err then return err end
    board.caller = caller
    return nil
end
return M
