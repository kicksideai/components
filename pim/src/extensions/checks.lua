-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Runs family check functions (kickside.pim.check entries).
-- A check receives CheckInput and returns { findings }.
local funcs = require("funcs")
local time = require("time")
local channel = require("channel")
local types = require("types")
local shape = require("shape")
local M = {}

local DEADLINE_MS = 250
local MAX_FINDINGS_BYTES = 8192

-- A check runs under the caller's frame, with its own budget even during fold.
local function invoke(fn: string, input: types.CheckInput): (unknown, error?)
    local timer, terr = time.timer(DEADLINE_MS)
    if terr then return nil, terr end
    local pending, err = funcs.new():async(fn, input)
    if err then
        timer:stop()
        return nil, err
    end
    local deadline = timer:response()
    local selected = channel.select({ pending:response():case_receive(), deadline:case_receive() })
    if selected.channel == deadline then
        local _, cerr = pending:cancel()
        return nil, errors.new({ kind = errors.TIMEOUT, retryable = false, message = fn .. " exceeded the family check deadline",
            details = { code = "check_timeout" }, cause = cerr })
    end
    timer:stop()
    local payload, perr = pending:result()
    if perr or not payload then return nil, perr end
    return payload:data()
end

function M.run(fn: string, input: types.CheckInput): ({ types.Finding }?, error?)
    local out, err = invoke(fn, input)
    if err then return nil, err end
    local findings = type(out) == "table" and (out :: { [string]: unknown }).findings or nil
    if shape.budget(findings, MAX_FINDINGS_BYTES) or not shape.findings(findings) then
        return nil, errors.new({ kind = errors.INVALID, retryable = false, message = fn .. " returned malformed or oversized findings",
            details = { code = "check_result_invalid", field = "findings" } })
    end
    return findings :: { types.Finding }, nil
end

return M
