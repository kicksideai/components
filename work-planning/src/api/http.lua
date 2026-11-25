-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local http = require("http")
local json = require("json")
local access = require("access")
local handlers = require("handlers")
local schemas = require("schemas")
local M = {}

local function run(method: string)
    local res, req = http.response(), http.request()
    if not res or not req then return end
    local body = req:body()
    local input = body and json.decode(body) or nil
    if type(input) ~= "table" then return access.invalid_json(res) end
    -- Validate the wire representation before Lua drops null object values.
    local ok, invalid = json.validate_string(schemas[method].input, body)
    if not ok then
        return access.reject(res, errors.new({ kind = errors.INVALID, details = { code = "invalid_shape" },
            message = "Planning " .. method .. " request is malformed: " .. tostring(invalid) }))
    end
    local result, err = handlers[method](input)
    if err then return access.reject(res, err) end
    return access.respond(res, http.STATUS.OK, { success = true, data = result })
end

function M.plan_sprint() return run("plan_sprint") end
function M.move_dates() return run("move_dates") end
function M.check_capacity() return run("check_capacity") end
function M.set_capacity() return run("set_capacity") end
function M.workload() return run("workload") end
function M.roadmap() return run("roadmap") end
return M
