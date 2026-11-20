-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local component = require("component")

type Map = { [string]: unknown }
local function run(input: { op: string, board_id: string?, request: Map }): (unknown, error?)
    local request = input.request
    if input.op == "revoke" then
        return assert(component.get_service()):revoke_subtree({ root_component_id = input.board_id,
            subject = { subject_id = request.subject_id, subject_type = "user" } })
    end
    if input.op == "grant" then
        return assert(component.get_service()):grant_subtree({ root_component_id = input.board_id,
            subject = { subject_id = request.subject_id, subject_type = "user" }, access_mask = request.mask })
    end
    if input.op == "direct_resolve" then
        local def, err = contract.get("kickside.work:search_resolver")
        if err or not def then return nil, err end
        local client, cerr = def:open("kickside.work_search:resolver", request.context)
        if cerr or not client then return nil, cerr end
        return client:resolve_ids({ board_id = input.board_id, query = request.query, limit = 10 })
    end
    request.board_id = input.board_id
    local def, err = contract.get("kickside.work:board")
    if err or not def then return nil, err end
    local client, open_err = def:open()
    if open_err or not client then return nil, open_err end
    local invoke = client[input.op]
    return invoke(client, request)
end
return { run = run }
