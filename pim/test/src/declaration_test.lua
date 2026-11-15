-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry = require("registry")
local test = require("test")
local function define()
    test.describe("owned dependency declarations", function()
        test.it("keeps retention scheduling outside projection commits", function()
            local entry = assert(registry.get("kickside.pim.persist:projection_committed"))
            test.is_nil(entry.data.imports.retention)
            local listeners = assert(registry.find({ [".ns"] = "kickside.pim.retention", [".kind"] = "process.lua" }))
            test.eq(#listeners, 0)
        end)
        test.it("imports only libraries consumed by its source", function()
            for _, entry in ipairs(assert(registry.find({}))) do
                local id = tostring(entry.id)
                if id:match("^kickside%.pim[%.:]") and type(entry.data.source) == "string" then
                    for name in pairs(entry.data.imports or {}) do
                        local source = entry.data.source
                        test.is_true(source:find('require("' .. name .. '")', 1, true) ~= nil
                            or source:find("require('" .. name .. "')", 1, true) ~= nil,
                            id .. " consumes import " .. name)
                    end
                end
            end
        end)
    end)
end
return { run = test.run_cases(define) }
