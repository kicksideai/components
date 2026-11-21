-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Runs family check functions (kickside.pim.check entries).
-- A check receives CheckInput and returns { findings }.
local funcs = require("funcs")
local time = require("time")
local channel = require("channel")
local types = require("types")
local shape = require("shape")
local M = {}

local CHECK_TIMEOUT = "250ms"
local MAX_FINDINGS_BYTES = 8192

-- A check runs under the caller's frame, with its own budget even during fold.
local function invoke(fn: string, input: types.CheckInput): (unknown, error?)
    local timer, terr = time.timer(CHECK_TIMEOUT)
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

local function invalid(fn: string, field: string, message: string): error
    return errors.new({ kind = errors.INVALID, retryable = false, message = fn .. " " .. message,
        details = { code = "check_result_invalid", field = field } })
end

function M.run(fn: string, input: types.CheckInput): ({ types.Finding }?, error?)
    local out, err = invoke(fn, input)
    if err then return nil, err end
    if type(out) ~= "table" then return nil, invalid(fn, "result", "returned no result") end
    local findings = (out :: { [string]: unknown }).findings
    if shape.budget(findings, MAX_FINDINGS_BYTES) then return nil, invalid(fn, "findings", "returned oversized findings") end
    if shape.array_length(findings) == nil then return nil, invalid(fn, "findings", "returned no findings list") end
    for _, finding in ipairs(findings :: { unknown }) do
        if type(finding) ~= "table" or type((finding :: { [string]: unknown }).message) ~= "string" then
            return nil, invalid(fn, "message", "returned a finding without a message")
        end
    end
    if not shape.findings(findings) then return nil, invalid(fn, "finding", "returned malformed finding fields") end
    return findings :: { types.Finding }, nil
end

return M
