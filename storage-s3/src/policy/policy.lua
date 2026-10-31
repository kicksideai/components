local resources_config = require("resources_config")
local M = {}

function M.validate_syntax(args: any): any
    local value = type(args) == "table" and args.value or nil
    local function invalid(message: string): any return { valid = false, error = message } end
    if type(value) ~= "table" then return invalid("Storage policy must be an object") end
    for key in pairs(value) do
        if key ~= "mode" and key ~= "resource_id" and key ~= "prefix" then return invalid("Unknown storage policy field") end
    end
    if value.mode ~= "local" and value.mode ~= "s3" then return invalid("Choose local or S3 storage") end
    if type(value.resource_id) ~= "string" or type(value.prefix) ~= "string" then return invalid("Storage resource and prefix are required strings") end
    if #value.prefix == 0 or #value.prefix > 256 or value.prefix:sub(1, 1) == "/" or value.prefix:sub(-1) == "/"
        or value.prefix:find("[^%w_/%-%.]") or value.prefix:find("//", 1, true) then
        return invalid("Use a relative object prefix of 1–256 letters, numbers, slashes, dots, dashes, or underscores")
    end
    for segment in value.prefix:gmatch("[^/]+") do
        if segment == "." or segment == ".." then return invalid("Prefix cannot contain dot path segments") end
    end
    return { valid = true }
end

function M.validate(args: any): any
    local checked = M.validate_syntax(args)
    if not checked.valid then return checked end
    local value = args.value
    if value.mode == "s3" then
        local available, available_err = resources_config.has_s3_entry(value.resource_id)
        if available_err then return { valid = false, error = "Could not discover native S3 storage resources" } end
        if not available then return { valid = false, error = "Select a discovered native S3 storage resource" } end
    end
    return { valid = true }
end

return M
