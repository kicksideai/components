-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Type functions (spec 3.1): a type declares config_schema, normalize and
-- validate; compile checks attribute config, prepare runs each function once
-- per attribute per command as the caller, and a function that fails makes
-- the command unavailable.
local test = require("test")
local fixture = require("fixture")
local steps = require("steps")
local types = require("types")
local sql = require("sql")
local json = require("json")

type Map = { [string]: unknown }

local CODE = "app:code_type"

local function calls(fn: string): { { n: integer } }
    local db = assert(sql.get("app:db"))
    assert(db:execute("CREATE TABLE IF NOT EXISTS pim_test_type_calls (fn TEXT NOT NULL, n INTEGER NOT NULL)", {}))
    local rows, err = db:query("SELECT n FROM pim_test_type_calls WHERE fn = $1", { fn })
    db:release()
    assert(not err, tostring(err))
    return rows :: { { n: integer } }
end

local function reset_calls()
    local db = assert(sql.get("app:db"))
    assert(db:execute("CREATE TABLE IF NOT EXISTS pim_test_type_calls (fn TEXT NOT NULL, n INTEGER NOT NULL)", {}))
    assert(db:execute("DELETE FROM pim_test_type_calls", {}))
    db:release()
end

local function coded(length: integer?): fixture.Handle
    local h = fixture.catalog()
    local attr: Map = { code = "code", type = CODE, index = "key" }
    if length then attr.config = { length = length } end
    local _, err = h.call("apply_schema", { declaration = { aspects = { { namespace = "ids", attributes = { attr } } } } })
    assert(not err, tostring(err))
    return h
end

local function define()
    test.describe("type functions", function()
        for _, changed in ipairs({ false, true }) do
            test.it(changed and "prepares again against the winning schema after a generation conflict" or "keeps preparation after a head conflict in the same generation", function()
                local h = coded(4)
                reset_calls()
                local out, err = h.call("apply_conflicted", { changed_generation = changed, request = { items = {
                    { product = { sku = "CONFLICTED" }, create = {}, set = { { attr = "ids.code", value = "abcd" } } },
                } } })
                test.is_nil(err, tostring(err))
                test.eq(#calls("normalize"), changed and 2 or 1)
                test.eq(#calls("validate"), changed and 2 or 1)
                test.eq(out.outcomes[1].outcome, changed and "invalid" or "created")
                local stored, read_err = steps.get(h, "CONFLICTED")
                if changed then
                    test.eq(out.outcomes[1].findings[1].code, "wrong_length")
                    test.is_false(out.applied)
                    test.is_nil(out.seq)
                    test.not_nil(out.as_of)
                    test.is_nil(stored)
                    test.eq(assert(read_err):kind(), errors.NOT_FOUND)
                else
                    test.is_true(out.applied)
                    test.is_nil(read_err, tostring(read_err))
                    test.eq(assert(stored).values["ids.code"].value, "ABCD")
                    test.is_true(out.as_of >= assert(out.seq))
                end
            end)
        end

        test.it("imports accepted canonical values without normalization validation or enforced checks", function()
            local source = coded(nil)
            assert(source.call("apply_schema", { declaration = { families = { { code = "imported", aspects = { "core", "ids" } } } } }))
            test.eq(steps.one(source, { product = { sku = "IMPORTED" }, create = { family = "imported" }, set = { { attr = "ids.code", value = "abcde" } } }).outcome, "created")
            local declared, derr = source.call("apply_schema", { declaration = {
                aspects = { { namespace = "ids", attributes = { { code = "code", type = CODE, config = { length = 4 }, index = "key" } } } },
                families = { { code = "imported", aspects = { "core", "ids" }, checks = { { check = "app:actor_check", reads = { "ids.code" }, enforce = "write" } } } },
            } })
            test.is_nil(derr, tostring(derr))
            steps.rebuilt(source)
            local path = "type-import-" .. source.id
            local exported, eerr = source.call("portable", { method = "export", args = { storage_id = "app:exports", path = path } })
            test.is_nil(eerr, tostring(eerr))
            test.is_true(exported.success)
            reset_calls()
            local target = fixture.catalog({ bare = true })
            local imported, ierr = target.call("portable", { method = "import_into", args = { storage_id = "app:exports", path = path } })
            test.is_nil(ierr, tostring(ierr))
            test.is_true(imported.success, json.encode(imported))
            test.eq(#calls("normalize"), 0)
            test.eq(#calls("validate"), 0)
            test.eq(assert(steps.get(target, "IMPORTED")).values["ids.code"].value, "ABCDE")
            local refused = steps.one(target, { product = { sku = "IMPORTED" }, expect_version = "any", set = { { attr = "ids.code", value = "ABCDE" } } })
            test.eq(refused.outcome, "invalid")
            test.eq(assert(refused.findings)[1].code, "wrong_length")
        end)

        test.it("checks attribute config against the type's config schema at compile", function()
            local h = fixture.catalog()
            for _, bad in ipairs({ { length = "6" }, { length = 0 }, { size = 6 } } :: { Map }) do
                local _, err = h.call("plan_schema", { declaration = { aspects = { { namespace = "ids", attributes = { { code = "code", type = CODE, config = bad } } } } } })
                test.not_nil(err, json.encode(bad))
                test.eq((err :: error):kind(), errors.INVALID)
            end
            coded(6)
            coded(nil)
        end)

        test.it("normalizes through the type once per attribute per command and stores the refined value", function()
            reset_calls()
            local h = coded(nil)
            local out = h.call("apply", { mode = "independent", items = {
                { product = { sku = "C-1" }, create = {}, set = { { attr = "ids.code", value = "ab c1" } } },
                { product = { sku = "C-2" }, create = {}, set = { { attr = "ids.code", value = "ab c1" } } },
                { product = { sku = "C-3" }, create = {}, set = { { attr = "ids.code", value = "  " } } },
                { product = { sku = "C-4" }, create = {}, set = { { attr = "ids.code", value = 12 } } },
            } }) :: types.ApplyResult
            test.eq(out.outcomes[1].outcome, "created", json.encode(out))
            test.eq(out.outcomes[2].outcome, "created")
            test.eq(out.outcomes[3].outcome, "invalid")
            test.is_true(tostring(assert(out.outcomes[3].findings)[1].message):find("blank code", 1, true) ~= nil)
            test.eq(out.outcomes[4].outcome, "invalid")
            test.eq(assert(steps.get(h, "C-1")).values["ids.code"].value, "ABC1")
            local normalized = calls("normalize")
            test.eq(#normalized, 1, json.encode(normalized))
            test.eq(normalized[1].n, 2)
            test.eq(#calls("validate"), 1)
            local found = h.call("query", { where = { field = "ids.code", op = "eq", value = "ABC1" } }) :: { items: { Map } }
            test.eq(#found.items, 2)
        end)

        test.it("rejects a value its findings fail and refuses the same value in a proposal", function()
            local h = coded(4)
            fixture.boot(h)
            local out = h.call("apply", { items = { { product = { sku = "C-1" }, create = {}, set = { { attr = "ids.code", value = "abcde" } } } } }) :: types.ApplyResult
            test.eq(out.outcomes[1].outcome, "invalid", json.encode(out))
            local finding = assert(out.outcomes[1].findings)[1]
            test.eq(finding.code, "wrong_length")
            test.eq(finding.attribute, "ids.code")
            test.is_nil((steps.get(h, "C-1")))
            test.eq(h.call("apply", { items = { { product = { sku = "C-1" }, create = {}, set = { { attr = "ids.code", value = "ab cd" } } } } }).outcomes[1].outcome, "created")
            local _, perr = h.call("propose", { items = { { product = { sku = "C-1" }, set = { { attr = "ids.code", value = "toolong" } } } } })
            test.eq((perr :: error):kind(), errors.INVALID)
        end)

        test.it("answers unavailable and applies nothing when a type function answers out of shape", function()
            local h = fixture.catalog()
            test.is_nil((select(2, h.call("apply_schema", { declaration = { aspects = { { namespace = "ids", attributes = { { code = "bad", type = "app:broken_type" } } } } } }))))
            local _, err = h.call("apply", { items = { { product = { sku = "B-1" }, create = {}, set = { { attr = "ids.bad", value = "x" } } } } })
            test.not_nil(err)
            test.eq((err :: error):kind(), errors.UNAVAILABLE)
            test.is_true((err :: error):retryable())
            test.eq(err:details().code, "contract_unavailable")
            test.is_nil((steps.get(h, "B-1")))
        end)
    end)
end

return { run = test.run_cases(define) }
