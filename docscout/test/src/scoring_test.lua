-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local scoring = require("scoring")
local evals = require("evals")
local json = require("json")

local function near(a: number, b: number): boolean return math.abs(a - b) < 1e-9 end

return { run = test.run_cases(function()
    test.describe("Scoring values", function()
        test.it("compares numbers as printed in documents", function()
            test.eq(scoring.value("number", 5188.4, "5,188.40", {}), 1)
            test.eq(scoring.value("number", 18500, "USD 18,500", {}), 1)
            test.eq(scoring.value("number", -5, "5", {}), 0)
            test.eq(scoring.value("number", 36, 36.0, {}), 1)
            test.eq(scoring.value("number", 36, "thirty-six", {}), 0)
        end)
        test.it("compares dates by their digits and enums ignoring case", function()
            test.eq(scoring.value("date", "2026-03-14", "2026/03/14", {}), 1)
            test.eq(scoring.value("date", "2026-03-14", "2026-03-15", {}), 0)
            test.eq(scoring.value("enum", "EUR", "eur", {}), 1)
            test.eq(scoring.value("enum", "EUR", "USD", {}), 0)
        end)
        test.it("scores text by word overlap", function()
            test.eq(scoring.value("text", "Northwind Fabrication GmbH", "northwind fabrication gmbh", {}), 1)
            local partial = scoring.value("text", "Northwind Fabrication GmbH", "Northwind Fabrication GmbH, Hamburg", {})
            test.is_true(partial > 0.8 and partial < 1)
            test.eq(scoring.value("text", "Delaware", "New York", {}), 0)
        end)
        test.it("keeps false distinct from missing", function()
            test.eq(scoring.value("boolean", false, false, {}), 1)
            test.eq(scoring.value("boolean", false, nil, {}), 0)
            test.eq(scoring.value("boolean", true, false, {}), 0)
        end)
        test.it("scores an unstated value as correct only when nothing was extracted", function()
            test.eq(scoring.value("text", nil, nil, {}), 1)
            test.eq(scoring.value("text", "", nil, {}), 1)
            test.eq(scoring.value("text", nil, "PO-1", {}), 0)
        end)
        test.it("scores lists as order-free F1 with each expected item used once", function()
            local field = { item_type = "text" }
            test.eq(scoring.value("list", { "a", "b", "c" }, { "c", "a", "b" }, field), 1)
            test.is_true(near(scoring.value("list", { "a", "b" }, { "a" }, field), 2 / 3))
            test.is_true(near(scoring.value("list", { "a" }, { "a", "a" }, field), 2 / 3))
            test.eq(scoring.value("list", {}, {}, field), 1)
            test.eq(scoring.value("list", { "a" }, "a", field), 0)
            test.eq(scoring.value("list", { 1, 2 }, { "1", "2" }, { item_type = "number" }), 1)
        end)
        test.it("pairs list items optimally, whatever their order", function()
            local field = { item_type = "text" }
            local a = scoring.value("list", { "red green", "red blue" }, { "red", "red green" }, field)
            local b = scoring.value("list", { "red green", "red blue" }, { "red green", "red" }, field)
            test.is_true(near(a, b), a .. " vs " .. b)
            test.is_true(a > 0.8)
        end)
        test.it("matches empty lists and objects only with empty ones", function()
            test.eq(scoring.value("object", { items = json.decode("[]") }, { items = { "invented" } }, {}), 0)
            test.eq(scoring.value("object", { items = json.decode("[]") }, { items = json.decode("[]") }, {}), 1)
        end)
        test.it("scores objects and lists of objects by their expected keys", function()
            local expected = { { item = "Aluminium housing", qty = 40 }, { item = "Assembly labour", qty = 12 } }
            local got = { { item = "Assembly labour", qty = 12, amount = 750 }, { item = "Aluminium housing", qty = 40 } }
            test.eq(scoring.value("list", expected, got, { item_type = "object" }), 1)
            test.eq(scoring.value("object", { city = "Hamburg", zip = "20457" }, { city = "Hamburg", zip = "20459" }, {}), 0.5)
            test.eq(scoring.value("object", { city = "Hamburg" }, "Hamburg", {}), 0)
        end)
    end)

    test.describe("Scoring a case", function()
        test.it("scores every field and reads missing values as absent", function()
            local fields = { { name = "total", type = "number" }, { name = "po", type = "text" }, { name = "paid", type = "boolean" } }
            local values = {
                total = { value = 1250, missing = false, verified = true },
                po = { missing = true, verified = true },
                paid = { value = false, missing = false, verified = false },
            }
            local scored = scoring.case(fields, { total = 1250, paid = false }, values)
            test.eq(scored[1].score, 1); test.is_true(scored[1].verified)
            test.eq(scored[2].score, 1); test.is_nil(scored[2].value)
            test.eq(scored[3].score, 1); test.is_false(scored[3].verified)
            local invented = scoring.case({ { name = "po", type = "text" } }, {}, { po = { value = "", missing = false, verified = true } })
            test.eq(invented[1].score, 0)
        end)
        test.it("averages accuracy per field over cases", function()
            local fields = { { name = "a" }, { name = "b" } }
            local metrics = scoring.metrics(fields, {
                { { score = 1, verified = true }, { score = 0, verified = false } },
                { { score = 0.5, verified = true }, { score = 1, verified = true } },
            })
            test.eq(metrics[1].accuracy, 0.75); test.eq(metrics[1].verified, 1)
            test.eq(metrics[2].accuracy, 0.5); test.eq(metrics[2].verified, 0.5)
        end)
    end)

    test.describe("Evaluation totals", function()
        local fields = { { name = "a" } }
        test.it("averages over completed cases and reports failed ones", function()
            local totals = evals.summarize(fields, {
                { status = "completed", scores = { { score = 1, verified = true } }, tokens = 100, duration_ms = 1000 },
                { status = "failed", scores = {}, tokens = 10, duration_ms = 200 },
            })
            test.eq(totals.status, "completed"); test.eq(totals.error, "1 case failed")
            test.eq(totals.metrics[1].accuracy, 1); test.eq(totals.tokens, 110); test.eq(totals.duration_ms, 1200)
        end)
        test.it("fails when every case failed", function()
            local totals = evals.summarize(fields, { { status = "failed", scores = {}, tokens = 0, duration_ms = 5 } })
            test.eq(totals.status, "failed"); test.eq(totals.error, "Every case failed")
        end)
    end)
end) }
