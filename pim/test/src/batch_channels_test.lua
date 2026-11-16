-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local function define()
    test.describe("per-item channel validation", function()
        for _, method in ipairs({ "release", "withdraw" }) do
            for _, case in ipairs({ { name = "object", value = {} }, { name = "true", value = true }, { name = "false", value = false } }) do
                test.it("keeps valid " .. method .. " items beside an invalid " .. case.name .. " channel", function()
                    local h = fixture.catalog()
                    fixture.boot(h)
                    if method == "withdraw" then
                        assert(h.call("release", { items = {
                            { product = { sku = "RDG-moss-40" }, expect_version = 1, channels = { "web" } },
                            { product = { sku = "RDG-moss-41" }, expect_version = 1, channels = { "web" } },
                        } }))
                    end
                    local out, err = h.call(method, { items = {
                        { product = { sku = "RDG-moss-40" }, expect_version = method == "release" and 1 or nil, channels = { case.value } },
                        { product = { sku = "RDG-moss-41" }, expect_version = method == "release" and 1 or nil, channels = { "web" } },
                    } })
                    test.is_nil(err, tostring(err))
                    test.not_nil(out)
                    test.eq(out.outcomes[1].outcome, "invalid")
                    test.eq(out.outcomes[1].findings[1].code, "invalid_channel")
                    test.eq(out.outcomes[2].outcome, method == "release" and "released" or "withdrawn")
                    local releases = assert(h.call("list_releases", { product = { sku = "RDG-moss-40" } }))
                    test.eq(#releases.releases, method == "release" and 0 or 1)
                    local got = assert(h.call("get", { product = { sku = "RDG-moss-40" } }))
                    local states: { [string]: string } = {}
                    for _, publication in ipairs(got.publications) do states[publication.channel] = publication.state end
                    test.eq(states.web, method == "withdraw" and "published" or nil)
                    local valid = assert(h.call("get", { product = { sku = "RDG-moss-41" } }))
                    for _, publication in ipairs(valid.publications) do
                        if publication.channel == "web" then test.eq(publication.state, method == "release" and "published" or "withdrawn") end
                    end
                end)
            end
        end
    end)
end
return { run = test.run_cases(define) }
