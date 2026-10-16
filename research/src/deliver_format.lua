local M = {}

local function trim(value: any): string
    if type(value) ~= "string" then return "" end
    return (value:gsub("^%s*(.-)%s*$", "%1"))
end

M.REPORT_SCHEMA = {
    type = "object",
    additionalProperties = false,
    required = { "title", "summary", "key_points", "sources" },
    properties = {
        title = { type = "string", minLength = 1 },
        summary = { type = "string", minLength = 1 },
        key_points = { type = "array", items = { type = "string" } },
        sources = { type = "array", items = {
            type = "object", additionalProperties = false,
            required = { "url", "title" },
            properties = { url = { type = "string", minLength = 1 }, title = { type = "string" } },
        } },
    },
}

function M.to_report(raw: any): (any, string?)
    if type(raw) ~= "table" then return nil, "a structured report object is required" end
    if trim(raw.title) == "" or trim(raw.summary) == "" then return nil, "report title and summary are required" end
    if type(raw.key_points) ~= "table" or type(raw.sources) ~= "table" then return nil, "report key_points and sources arrays are required" end
    for key, point in pairs(raw.key_points) do
        if type(key) ~= "number" or key < 1 or key % 1 ~= 0 or type(point) ~= "string" then return nil, "report key_points must contain strings" end
    end
    for key, source in pairs(raw.sources) do
        if type(key) ~= "number" or key < 1 or key % 1 ~= 0 or type(source) ~= "table" or trim(source.url) == "" or type(source.title) ~= "string" then
            return nil, "report sources require url and title"
        end
    end
    return raw, nil
end

function M.urls_of(report: any): { string }
    local out: { string } = {}
    for _, source in ipairs(report.sources) do out[#out + 1] = source.url end
    return out
end

-- render_markdown(report) -> markdown string. The result the UI shows.
function M.render_markdown(report: any): string
    report = type(report) == "table" and report or {}
    local parts: { string } = {}
    local title = trim((report :: any).title)
    if title ~= "" then parts[#parts + 1] = "# " .. title end
    local summary = trim((report :: any).summary)
    if summary ~= "" then parts[#parts + 1] = summary end
    local kp = (report :: any).key_points
    if type(kp) == "table" and #(kp :: { any }) > 0 then
        parts[#parts + 1] = "## Key points"
        for _, p in ipairs(kp :: { any }) do
            if type(p) == "string" and trim(p) ~= "" then parts[#parts + 1] = "- " .. trim(p) end
        end
    end
    local urls = M.urls_of(report)
    if #urls > 0 then
        parts[#parts + 1] = "## Sources"
        for _, u in ipairs(urls) do parts[#parts + 1] = "- " .. u end
    end
    return table.concat(parts, "\n\n")
end

return M
