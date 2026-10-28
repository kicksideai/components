-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The extraction contract: runs an extractor under the caller's identity for
-- agents, Workflows and evaluations.
local engine = require("engine")

local function invalid(message: string): error return errors.new({ kind = errors.INVALID, message = message }) end

local CALLERS = { ui = true, agent = true, workflow = true, eval = true }

local function run(input: any): (any?, error?)
    if type(input) ~= "table" then return nil, invalid("Request must be an object") end
    local caller = input.caller or "agent"
    if not CALLERS[caller] then return nil, invalid("caller must be ui, agent, workflow or eval") end
    return engine.run({ id = input.extractor_id, upload_id = input.upload_id, caller = caller, deadline = input.deadline, evaluation_id = input.evaluation_id, case_id = input.case_id })
end

return { run = run }
