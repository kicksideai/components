-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local apply_ops = require("apply_ops")
local process_report = require("process_report")
local locate = require("locate")
local requests = require("requests")
local commands = require("commands")
local M = {}

local function process_command(method: string, input: unknown): (commands.ApplyResult?, error?)
    local err = requests.parse(method, input)
    if err then return nil, err end
    local request = input :: { [string]: unknown }
    local op: commands.Op = { op = method }
    for key, value in pairs(request) do
        if key == "item" or key == "visit" or key == "attempt" or key == "kind" or key == "outcome" or key == "outputs" or key == "progress" or key == "decision" then
            (op :: { [string]: unknown })[key] = value
        end
    end
    if method == "report" then
        local finding = process_report.validate(op, request.key ~= nil)
        if finding then return nil, errors.new({ kind = errors.INVALID, details = { code = finding.code }, message = finding.message }) end
    end
    local id, lerr = locate.resolve(request.board_id :: string?)
    if lerr or not id then return nil, lerr end
    return apply_ops.apply({ board_id = id, key = request.key, source = request.source, origin = request.origin,
        trace_context = request.trace_context, ops = { op }, mode = "atomic" } :: commands.ApplyRequest)
end

function M.approve(input: unknown): (commands.ApplyResult?, error?) return process_command("approve", input) end
function M.report(input: unknown): (commands.ApplyResult?, error?) return process_command("report", input) end

return M
