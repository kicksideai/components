-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local fixture = require("fixture")
local test = require("test")
local checks = require("checks")
local failure = require("failure")
local funcs = require("funcs")

local function define()
    test.describe("native public error codes", function()
        test.it("gives shared invalid requests a stable code while keeping supplied details", function()
            test.eq(failure.invalid("request is malformed"):details().code, "invalid_request")
            local err = failure.invalid("schema is stale", { code = "schema_stale", generation = 3 })
            test.eq(err:details().code, "schema_stale")
            test.eq(err:details().generation, 3)
        end)
        test.it("adds a boundary code without replacing a received native classification", function()
            local original = errors.new({ kind = errors.PERMISSION_DENIED, retryable = false, message = "source denies access", details = { actor = "caller" } })
            local coded = failure.coded(original, "boundary_denied")
            test.eq(coded:kind(), errors.PERMISSION_DENIED)
            test.is_false(coded:retryable())
            test.eq(coded:details().code, "boundary_denied")
            test.eq(coded:details().actor, "caller")
            test.eq(coded:details().cause.kind, original:kind())
            local specific = errors.new({ kind = errors.CONFLICT, message = "specific conflict", details = { code = "specific_conflict" } })
            test.eq(failure.coded(specific, "boundary_conflict"):details().code, "specific_conflict")
        end)

        test.it("codes malformed check answers", function()
            for name, field in pairs({ silent_check = "findings", scalar_check = "result", wordless_check = "message" }) do
                local out, err = checks.run("app:" .. name, { config = {}, view = {}, product = { product_id = "p", sku = "P", family = "generic", level = 0 } })
                test.is_nil(out)
                test.eq(err:kind(), errors.INVALID)
                test.eq(err:details().code, "check_result_invalid")
                test.eq(err:details().field, field)
            end
        end)
        test.it("returns coded native errors for malformed job invocations", function()
            for worker, code in pairs({ rebuild = "rebuild_job_invalid", term_merge = "term_merge_job_invalid", release_model = "release_model_job_invalid" }) do
                local out, err = funcs.call("kickside.pim.jobs:" .. worker, {})
                test.is_nil(out)
                test.eq(err:kind(), errors.INVALID, worker)
                test.eq(err:details().code, code, worker)
            end
        end)
    end)
    test.describe("error codes", function()
        test.it("returns stable codes with local read and command failures", function()
            local h = fixture.catalog()
            for _, case in ipairs({
                { method = "query", request = { limit = 0 }, kind = errors.INVALID, code = "invalid_request" },
                { method = "get", request = { product = { sku = "absent" } }, kind = errors.NOT_FOUND, code = "product_not_found" },
                { method = "get_release", request = { release_id = "absent" }, kind = errors.NOT_FOUND, code = "release_not_found" },
                { method = "get_schema", request = { generation = 999 }, kind = errors.NOT_FOUND, code = "schema_generation_not_found" },
                { method = "apply_schema", request = { expected_generation = 999, declaration = {} }, kind = errors.CONFLICT, code = "schema_generation_conflict" },
            }) do
                local value, err = h.call(case.method, case.request)
                test.is_nil(value)
                test.not_nil(err)
                test.eq(err:kind(), case.kind)
                test.eq(err:details().code, case.code)
            end
        end)
    end)

    test.describe("request condition classification", function()
        test.it("names missing sources, proposals and removal targets independently of their entrypoints", function()
            local h = fixture.catalog()
            for _, case in ipairs({
                { method = "apply", request = { source = "absent", items = { { product = { sku = "unknown-source" }, create = {} } } }, code = "unknown_source" },
                {method="propose",request={source="absent",items={{product={sku="unknown-source"},status="draft"}}},code="unknown_source"},
                { method = "decide", request = { proposal_id = "absent", decision = "accept" }, code = "proposal_not_found" },
                { method = "apply_schema", request = { declaration = { remove = { channels = { "absent" } } } }, code = "removal_target_not_found" },
            }) do
                local value, err = h.call(case.method, case.request)
                test.is_nil(value)
                test.not_nil(err)
                test.eq(err:details().code, case.code)
            end
        end)
    end)

end
return { run = test.run_cases(define) }
