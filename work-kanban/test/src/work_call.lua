-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local component = require("component")
local registry = require("registry")

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
    if input.op == "registry_get" then
        return registry.get(request.id)
    end
    local contract_id = "kickside.work:board"
    local method = input.op
    if method == "run_view" then
        contract_id = "kickside.work:view"
        method = "run"
    elseif method == "plan_close" or method == "close" then
        contract_id = "kickside.work.planning:sprints"
    end
    if method ~= "close" and method ~= "run" then request.board_id = input.board_id end
    local def, err = contract.get(contract_id)
    if err or not def then return nil, err end
    local client, open_err = def:open()
    if open_err or not client then return nil, open_err end
    local invoke = client[method]
    return invoke(client, request)
end
return { run = run }
