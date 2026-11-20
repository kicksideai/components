-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Harness calls retain the session's actor and installation scope.
local contract = require("contract")
local security = require("security")
local component = require("component")
local envelope = require("envelope")
local funcs = require("funcs")
local uuid = require("uuid")
local threads = require("threads")
local prefix_registry = require("prefix_registry")
local M = {}
type Map = { [string]: unknown }
type Service = { [string]: (Service, unknown) -> (unknown, error?) }
function M.register_schemaless(): (unknown, error?)
    local id = uuid.v4()
    local result, err = assert(component.get_service()):register({
        component_id = id, impl_id = "kickside.work.binding:board", meta = { title = "Schema-less board" },
    })
    if err then return nil, err end
    local failure = envelope.error_of(result, "register")
    if failure then return nil, failure end
    local _, thread_err = assert(threads.open()):ensure_thread({ component_id = id, impl_id = "kickside.work.binding:board", thread_class = "work.board" })
    if thread_err then return nil, thread_err end
    return { board_id = id }, nil
end

function M.run(input: Map): (unknown, error?)
    local op = input.op :: string
    local req = (input.request or {}) :: Map
    if op == "prefix_registry_ready" then
        local client, err = threads.open()
        if not client then return nil, err end
        return prefix_registry.version(client, "TEST-READY")
    end
    if op == "register_schemaless" then return funcs.call("app:register_schemaless_board") end
    if op == "publish_flow" then return funcs.call("app:publish_flow") end
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
