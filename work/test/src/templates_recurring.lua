-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local automations = require("automations")
local component = require("component")

local function run(input)
    if input.op == "control" then
        return automations.control(input.automation_id, { control = input.control, request_id = input.request_id })
    end
    if input.op == "component" then
        local rows, err = component.query({ component_ids = { input.automation_id }, limit = 1 })
        return rows and rows[1], err
    end
    local target = { kind = "action", port = "kickside.work.templates:recurring", config = {
        board_id = input.board_id, template_id = "weekly", version = input.version },
        input = { overrides = input.overrides } }
    if input.op == "reconfigure" then return automations.reconfigure(input.automation_id, { target = target }) end
    return automations.install_type("kickside.automation.recurring:task", {
        title = "Weekly task", schedule = { type = "interval", expression = "1h" }, target = target,
    }, input.board_id)
end

return { run = run }
