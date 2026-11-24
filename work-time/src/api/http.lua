-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local http = require("http")
local json = require("json")
local errors = require("errors")
local access = require("access")
local handlers = require("handlers")
local schemas = require("schemas")
local csv = require("csv")
local M = {}

type Body = { [string]: unknown }

local function request(req: http.Request, method: string, query: boolean, entry: boolean?): Body?
    local input: Body
    if query then
        input = (req:query_params() or {}) :: Body
        for _, name in ipairs(schemas[method].numeric) do
            if input[name] ~= nil then input[name] = tonumber(input[name]) or input[name] end
        end
    else
        local body = req:body()
        local decoded = body and body ~= "" and json.decode(body) or nil
        if type(decoded) ~= "table" then return nil end
        input = decoded :: Body
    end
    input.board_id = req:param("board")
    if entry then input.id = req:param("id") end
    return input
end

local function run(method: string, query: boolean?, entry: boolean?)
    local res, req = http.response(), http.request()
    if not res or not req then return end
    local input = request(req, method, query == true, entry)
    if not input then return access.invalid_json(res) end
    local result, err = handlers[method](input)
    if err then return access.reject(res, err) end
    return access.respond(res, http.STATUS.OK, { success = true, data = result })
end

function M.create() return run("create") end
function M.edit() return run("edit", false, true) end
function M.delete() return run("delete", false, true) end
function M.list() return run("list", true) end
function M.totals() return run("totals") end
function M.summary() return run("summary") end

function M.export()
    local res, req = http.response(), http.request()
    if not res or not req then return end
    local input = request(req, "export", true)
    local report, err = handlers.totals(input)
    if err or not report then
        return access.reject(res, err or errors.new({ kind = errors.INTERNAL, message = "Time export returned no report",
            details = { code = "time_export_missing_report" } }))
    end
    if report.cursor then res:set_header("X-Work-Time-Cursor", report.cursor) end
    res:set_header("Content-Disposition", 'attachment; filename="timesheet.csv"')
    res:set_content_type("text/csv; charset=utf-8")
    res:set_status(http.STATUS.OK)
    res:write(csv.render(report))
end

return M
