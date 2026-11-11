-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local json = require("json")
local fs = require("fs")
local canonical_json = require("canonical_json")

local M = {}

function M.structured(args: any): (any?, error?)
    local capture = args.options and args.options.capture_requests
    if capture then
        local storage = assert(fs.get("app:uploads"))
        local requests = assert(json.decode(assert(storage:readfile(capture))))
        requests[#requests + 1] = args
        local _, write_err = storage:writefile(capture, assert(canonical_json.encode(requests)))
        assert(write_err == nil, tostring(write_err))
    end
    local count = args.schema.properties.contexts.minItems
    local contexts = {}
    for i = 1, count do contexts[i] = "Fixture context" end
    return { result = { data = { contexts = contexts } }, tokens = { prompt_tokens = 1, completion_tokens = count } }, nil
end

function M.status(_args: any): (any?, error?) return { status = "ready" }, nil end

return M
