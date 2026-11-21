-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = {}

type TypeInput = { values: { string } }
type SupplierInput = { ids: { string } }
local SUPPLIER = "northwind"

function M.normalize(input: TypeInput)
    local results = {}
    for i, value in ipairs(input.values) do
        results[i] = { value = value:upper() }
    end
    return { results = results }
end

function M.validate(input: TypeInput)
    local results = {}
    for i, value in ipairs(input.values) do
        results[i] = { findings = value:match("^[A-Z][A-Z]%-%d+$") and {}
            or { { code = "certificate_format", message = "Use a region followed by a certificate number, for example EU-123." } } }
    end
    return { results = results }
end

function M.schema(input: { config: { region: string } })
    return { version = input.config.region, fragment = { aspects = { { namespace = "compliance", attributes = {
        { code = "certificate", type = "app.compliance:certificate", index = "key" },
        { code = "supplier", type = "kickside.pim.types:link", index = "key", config = { target = "compliance.supplier" } },
    } } } } }
end

function M.resolve(input: SupplierInput)
    local ids: { string } = {}
    for _, id in ipairs(input.ids) do
        if id == SUPPLIER then ids[#ids + 1] = id end
    end
    return { ids = ids }
end

function M.describe(input: SupplierInput)
    local targets = {}
    for _, id in ipairs(M.resolve(input).ids) do
        targets[id] = { label = "Northwind Supplies" }
    end
    return { targets = targets }
end

function M.check(input: { config: { mode: string? }, view: { [string]: { [string]: string } } }): (unknown, error?)
    local mode = input.config.mode
    if mode == "error" then error("supplier check failed") end
    if mode == "timeout" then
        return nil, errors.new({ kind = errors.TIMEOUT, message = "supplier check exceeded its deadline" })
    end
    if mode == "blocked" then
        local channel = require("channel")
        local wait = channel.new()
        wait:receive()
    end
    if mode == "slow" then require("time").sleep("2s") end
    if mode == "scalar" then return "pass", nil end
    if mode == "oversized" then return { findings = { { message = string.rep("missing certificate ", 10000) } } }, nil end
    if not (input.view["compliance.certificate"] or {})[""] then
        return { findings = { { code = "certificate_required", message = "Enter a supplier certificate." } } }, nil
    end
    return { findings = {} }, nil
end

return M
