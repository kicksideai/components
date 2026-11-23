-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local requests = require("requests")
local locate = require("locate")
local reader = require("reader")
local types = require("types")

local function get_schema(input: unknown): (types.SchemaView?, error?)
    local err = requests.parse("get_schema", input, "kickside.work:consumer_board")
    if err then return nil, err end
    local request = input :: types.SchemaGetRequest
    local id, lerr = locate.resolve(request.board_id)
    if lerr or not id then return nil, lerr end
    request.board_id = id
    return reader.get_schema(request)
end

return { get_schema = get_schema }
