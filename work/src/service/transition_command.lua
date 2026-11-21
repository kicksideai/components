-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local apply_ops = require("apply_ops")
local commands = require("commands")
local funcs = require("funcs")
local guard = require("guard")
local locate = require("locate")
local registry = require("registry")
local requests = require("requests")

local function run(input: unknown): (commands.ApplyResult?, error?)
    if type(input) ~= "table" or type(input.command) ~= "string" then
        return nil, guard.invalid("transition command required")
    end
    local entry, err = registry.get(input.command)
    if err then return nil, err end
    if not entry or entry.kind ~= "function.lua" or (entry.meta or {}).type ~= "kickside.work.transition_command" then
        return nil, guard.invalid("transition command is not registered", { code = "transition_command_unregistered" })
    end
    local prepared, prepare_err = funcs.call(entry.id, input.input)
    if prepare_err then return nil, prepare_err end
    local invalid = requests.parse("apply", prepared)
    if invalid then return nil, invalid end
    local request = prepared :: commands.ApplyRequest
    if request.mode ~= "atomic" or request.expected_head == nil or request.key == nil then
        return nil, guard.invalid("transition command requires an atomic request with an expected head and key")
    end
    local transition: commands.Op? = nil
    for _, op in ipairs(request.ops) do
        if op.op == "transition" then
            if transition then return nil, guard.invalid("transition command must prepare exactly one transition") end
            transition = op
        end
    end
    if not transition then return nil, guard.invalid("transition command must prepare exactly one transition") end
    local board_id, locate_err = locate.resolve(request.board_id)
    if locate_err or not board_id then return nil, locate_err end
    request.board_id = board_id
    return apply_ops.apply(request, nil, nil, { owner = entry.id, operation = transition })
end

return { run = run }
