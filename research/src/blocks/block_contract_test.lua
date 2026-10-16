local test = require("test")
local registry = require("registry")
local worker = require("worker")

type Map = { [string]: any }

local BLOCK_ID = "kickside.research:block.research"

local function map(value: any): Map
    return type(value) == "table" and (value :: Map) or {}
end

local function assert_block(entry: any)
    test.not_nil(entry, BLOCK_ID .. " is missing")
    local row = map(entry)
    local meta = map(row.meta)
    local block = map(map(row.data).block)
    test.eq(row.kind, "registry.entry")
    test.eq(meta.type, "kickside.block")
    test.eq(meta.public, true)
    test.eq(block.api_version, "kickside.block/v1")
    test.eq(map(block.input).type, "object")
    test.eq(map(block.config).type, "object")
    test.eq(map(block.output).type, "object")
    test.eq(map(block.error).type, "object")
    test.eq(map(block.execution).kind, "wait")
    test.eq(map(block.execution).arm_id, "kickside.research:arm_research_block")
    test.eq(map(block.presentation).category, "Agents")
    test.eq((block.ports :: { any })[1].id, "result")
    test.eq((block.ports :: { any })[2].id, "research_failed")
    test.eq((block.ports :: { any })[3].id, "failed")
    test.is_nil(meta.lowering)
    test.is_nil(meta.config_schema)
end

local function run()
    test.describe("kickside.research canonical Block", function()
        test.it("admits its resume projection through core's worker validator", function()
            local parsed, parse_err = worker.parse("func://kickside.research:resume_research_block_signal", true)
            test.is_nil(parse_err)
            test.not_nil(parsed)
            local admitted, admission_err = worker.validate(parsed, false)
            test.is_nil(admission_err, tostring(admission_err))
            test.not_nil(admitted)
        end)

        test.it("declares one strict standalone Research wait Block", function()
            local entry, err = registry.get(BLOCK_ID)
            test.is_nil(err)
            assert_block(entry)
        end)
    end)
end

return { run = test.run_cases(run) }
