-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")

local READ, WRITE, ADMIN = 1, 2, 8

local function denied(err: unknown, what: string)
    test.not_nil(err, what)
    test.eq(err:kind(), errors.PERMISSION_DENIED, what .. ": " .. tostring(err))
end

local function define()
    test.describe("catalog access", function()
        test.it("grants exactly what each access level allows", function()
            local h = fixture.catalog()
            fixture.boot(h)
            local version = h.call("get", { product = { sku = "RDG" } }).product.version
            local edit = { items = { { product = { sku = "RDG" }, expect_version = version,
                set = { { attr = "core.name", ctx = { locale = "en" }, value = "Edited" } } } } }
            local proposal = { items = { { product = { sku = "RDG" }, set = { { attr = "core.name", ctx = { locale = "en" }, value = "Proposed" } } } } }
            local plan = { declaration = { aspects = { { namespace = "core", attributes = { { code = "season", type = "kickside.pim.types:text" } } } } } }

            local outsider = fixture.user(h)
            local _, e1 = outsider("get", { product = { sku = "RDG" } })
            denied(e1, "outsider get")
            local _, e2 = outsider("apply", edit)
            denied(e2, "outsider apply")
            local _, e3 = outsider("propose", proposal)
            denied(e3, "outsider propose")

            local reader, reader_id = fixture.user(h)
            local _, gerr = h.call("grant", { subject_id = reader_id, mask = READ })
            test.is_nil(gerr)
            test.not_nil((reader("get", { product = { sku = "RDG" } })))
            local p, perr = reader("propose", proposal)
            test.is_nil(perr)
            local _, e4 = reader("apply", edit)
            denied(e4, "reader apply")
            local _, e5 = reader("decide", { proposal_id = p.proposal_id, decision = "accept" })
            denied(e5, "reader decide")

            local writer, writer_id = fixture.user(h)
            h.call("grant", { subject_id = writer_id, mask = READ + WRITE })
            local applied, aerr = writer("apply", edit)
            test.is_nil(aerr)
            test.eq(applied.outcomes[1].outcome, "updated")
            local _, e6 = writer("plan_schema", plan)
            denied(e6, "writer plan_schema")

            local admin, admin_id = fixture.user(h)
            h.call("grant", { subject_id = admin_id, mask = READ + WRITE + ADMIN })
            local planned, serr = admin("plan_schema", plan)
            test.is_nil(serr)
            test.eq(planned.class, "additive")
        end)
    end)
end

return { run = test.run_cases(define) }
