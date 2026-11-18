-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local compiler = require("compiler")
local tool_caller = require("caller")
local M = {}
type Map = { [string]: unknown }
function M.run(input: Map): (unknown, error?)
    local result, err = compiler.compile({ id = "work-agent", traits = {
        { id = "kickside.work.traits:work", context = { board_id = input.board_id } },
        { id = "kickside.work.traits:work_admin", context = { board_id = input.board_id } },
    } })
    if err then return nil, errors.new({ kind = errors.INTERNAL, message = err, details = { code = "compile_failed" } }) end
    return result, nil
end

function M.execute(input: Map): (unknown, error?)
    local compiled, compile_err = M.run(input)
    if compile_err then return nil, compile_err end
    local requested = {}
    for _, call in ipairs(input.calls) do
        local tool = assert(compiled.tools[call.name], call.name)
        requested[#requested + 1] = {
            id = call.name, name = call.name, arguments = call.arguments,
            registry_id = tool.registry_id, context = tool.context,
        }
    end
    local caller = tool_caller.new()
    local validated, validation_err = caller:validate(requested)
    assert(validated, tostring(validation_err))
    local result, err = caller:execute({}, validated)
    assert(result, tostring(err))
    local out = {}
    for name, answer in pairs(result) do
        local failure = answer.error
        if type(failure) == "userdata" then
            out[name] = { kind = failure:kind(), code = failure:details().code, retryable = failure:retryable() }
        else
            out[name] = { result = answer.result, error = failure }
        end
    end
    return out, nil
end
return M
