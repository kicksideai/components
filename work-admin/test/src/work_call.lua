-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Harness calls retain the session's actor and installation scope.
local contract = require("contract")
local security = require("security")
local component = require("component")
local M = {}
type Map = { [string]: unknown }
type Service = { [string]: (Service, unknown) -> (unknown, error?) }
function M.run(input: Map): (unknown, error?)
    local op = input.op :: string
    local req = (input.request or {}) :: Map
    if op == "grant" then
        return assert(component.get_service()):grant_subtree({ root_component_id = input.board_id,
            subject = { subject_id = req.subject_id, subject_type = "user" }, access_mask = req.mask })
    end
    if input.board_id then req.board_id = input.board_id end
    local def = assert(contract.get("kickside.work:board"))
    local actor = assert(def:with_actor(security.actor()))
    local scoped = assert(actor:with_scope(security.scope()))
    local service = assert(scoped:open()) :: Service
    local fn = assert(service[op], "unknown harness operation")
    return fn(service, req)
end
return M
