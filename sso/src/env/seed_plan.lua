local M = {}

type PlanItem = { key: string, value: any }

local trim = require("trim_text").trim

function M.split_csv(value: any): { string }
    local out: { string } = {}
    for item in tostring(value or ""):gmatch("[^,]+") do
        local v = trim(item)
        if v ~= "" then out[#out + 1] = v end
    end
    return out
end

function M.global_plan(values: { [string]: any }): { PlanItem }
    local plan: { PlanItem } = {}

    local base_path = trim(tostring(values.public_base_path or ""))
    if base_path ~= "" then
        plan[#plan + 1] = { key = "public_base_path", value = base_path }
    end

    local domains = M.split_csv(values.allowed_email_domains)
    if #domains > 0 then
        plan[#plan + 1] = { key = "allowed_email_domains", value = domains }
        plan[#plan + 1] = { key = "auto_provision", value = true }

        local default_group = trim(tostring(values.default_group or ""))
        if default_group ~= "" then
            plan[#plan + 1] = { key = "default_group", value = default_group }
        end
    end

    plan[#plan + 1] = { key = "enabled", value = true }
    return plan
end

return M
