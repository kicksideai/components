-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")

type Request = { [string]: unknown }
type WorkBoard = {
    get_schema: (self: WorkBoard, request: Request) -> (unknown, error?),
    plugin_context: (self: WorkBoard, request: Request) -> (unknown, error?),
    plugin_feed: (self: WorkBoard, request: Request) -> (unknown, error?),
    query: (self: WorkBoard, request: Request) -> (unknown, error?),
}

local function open(): (WorkBoard?, error?)
    local def, err = contract.get("kickside.work:board")
    if err or not def then return nil, err end
    local client, open_err = def:open()
    return client :: WorkBoard?, open_err
end

return { open = open }
