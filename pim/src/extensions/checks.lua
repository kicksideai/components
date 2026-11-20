-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Runs family check functions (kickside.pim.check entries).
-- A check receives CheckInput and returns { findings }.
local funcs = require("funcs")
local types = require("types")

local shape = require("shape")
local M = {}


-- run calls one check function; the check answers { findings }; any other output fails it.
function M.run(fn: string, input: types.CheckInput): ({ types.Finding }?, error?)
    local out, err = funcs.new():call(fn, input)
    if err then return nil, err end
    if type(out) ~= "table" then return nil, errors.new({ kind = errors.INVALID, message = fn .. " returned no result", details = { code = "check_result_invalid", field = "result" } }) end
    local findings = (out :: { [string]: unknown }).findings
    if shape.array_length(findings)==nil then return nil, errors.new({ kind = errors.INVALID, message = fn .. " returned no findings list", details = { code = "check_result_invalid", field = "findings" } }) end
    local out_findings: { types.Finding } = {}
    for _, f in ipairs(findings :: { unknown }) do
        if type(f) ~= "table" or type((f :: { [string]: unknown }).message) ~= "string" then
            return nil, errors.new({ kind = errors.INVALID, message = fn .. " returned a finding without a message", details = { code = "check_result_invalid", field = "message" } })
        end
        if not shape.findings({f}) then return nil,errors.new({kind=errors.INVALID,retryable=false,message=fn.." returned malformed finding fields",details={code="check_result_invalid",field="finding"}}) end
        out_findings[#out_findings + 1] = f :: types.Finding
    end
    return out_findings, nil
end

return M
