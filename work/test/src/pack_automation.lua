-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local ctx = require("ctx")
local automations = require("automations")
local M = {}
function M.prepare(input: { board_id: string }): (unknown, error?)
    return { state = { board_id = input.board_id }, metadata = { title = "Stage consumer" },
        source = { source_kind = "event", source_ref = "kickside.work.ports:stage_entered", source_thread_id = input.board_id, start = "new" }, enabled = false }, nil
end
-- The fixture kind uses the same declaration writer as published Automation kinds.
function M.reconfigure(input, options)
    local planned=assert(M.prepare(input))
    return automations.update_portable_input(ctx.get("component_id"),input,{source=planned.source,state=planned.state,
        expected_revision=options and options.expected_revision})
end
return M
