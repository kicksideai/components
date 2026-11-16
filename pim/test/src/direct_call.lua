-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Runs registry and invocation admission in the selected caller frame.
local funcs = require("funcs")
local registry = require("registry")
local M = {}
function M.run(input: { id: string, input: unknown, action: string? }): (unknown, error?)
    if input.action == "registry.get" then return registry.get(input.id) end
    if input.action == "registry.find" then return registry.find({ ["meta.type"] = "agent.trait" }) end
    return funcs.call(input.id, input.input)
end
return M
