-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local json = require("json")
local uuid = require("uuid")
local registry = require("registry")
local shapes = require("shapes")
local process = require("process")
local stages = require("stages")
local store = require("store")
local data = require("data")

local function context(source: string, a: string, b: string, second: integer, legacy: boolean?): any
    local chunks = { [1] = { ordinal = 1, content = a }, [2] = { ordinal = 2, content = b } }
    if not legacy then
        chunks[1].source_start, chunks[1].source_end = 1, #a
        chunks[2].source_start, chunks[2].source_end = second, second + #b - 1
    end
    return shapes.quote_context({ chunks[1], chunks[2] }, source)
end
local function located(quote: string, ctx: any, ordinals: { integer }?): (integer?, integer?)
    return shapes.locate(quote, 1, { [1] = shapes.normalize(ctx.chunks[1].content), [2] = shapes.normalize(ctx.chunks[2].content) }, ordinals or { 1, 2 }, ctx)
end
local function field(): any
    local f = assert(json.decode(assert(registry.get("kickside.docscout:config_schema")).data.schema_json)).properties.fields.items.default
    f.name, f.type = "total", "number"
    return f
end
return { run = test.run_cases(function()
    test.describe("Adjacent source evidence", function()
        test.it("joins short source overlaps using byte offsets", function()
            local first, last = located("alpha shared omega", context("alpha shared omega", "alpha shared", "shared omega", 7))
            test.eq(first, 1); test.eq(last, 2)
        end)
        test.it("keeps genuine repeated boundary text and rejects its deletion", function()
            local repeated = "standard repeated header for every page"
            local a, b = "alpha " .. repeated, repeated .. " omega"
            for _, legacy in ipairs({ false, true }) do
                local ctx = context(a .. " " .. b, a, b, #a + 2, legacy)
                test.is_nil((located("alpha " .. repeated .. " omega", ctx)))
                local first, last = located(a .. " " .. b, ctx)
                test.eq(first, 1); test.eq(last, 2)
            end
        end)
        test.it("never fabricates a repeated overlap in older chunks without offsets", function()
            local ctx = context("alpha shared omega", "alpha shared", "shared omega", 7, true)
            test.is_nil((located("alpha shared shared omega", ctx)))
            test.is_nil((located("alpha shared omega", ctx)))
            test.is_nil((shapes.locate("alpha omega", 1, { [1] = "alpha", [2] = "omega" }, { 1, 2 })))
        end)
        test.it("does not bridge excluded chunks or gaps containing unread text", function()
            local ctx = context("alpha hidden omega", "alpha", "omega", 14)
            test.is_nil((located("alpha omega", ctx)))
            ctx = context("alpha omega", "alpha", "omega", 7)
            test.is_nil((located("alpha omega", ctx, { 1 })))
            test.is_nil((shapes.locate("omega", 2, { [1] = "alpha", [2] = "omega" }, { 1 }, ctx)))
        end)
        test.it("normalizes LaTeX spacing only inside math spans and respects command names", function()
            test.eq(shapes.normalize("Value $x\\quad y$ units"), "value $x y$ units")
            test.eq(shapes.normalize("\\[x\\hspace{1em}y\\]"), string.char(92) .. "[x y" .. string.char(92) .. "]")
            test.eq(shapes.normalize("\\(x\\,y\\)"), string.char(92) .. "(x y" .. string.char(92) .. ")")
            for _, pair in ipairs({ { "path\\ name", "path name" }, { "1\\,000", "1 000" }, { "Prices: $ $ 5", "Prices: 5" },
                { "$\\quadratic$", "ratic" }, { "`$x\\quad y$`", "x y" }, { "Literal \\$x\\quad y\\$", "Literal x y" } }) do
                test.is_true(shapes.normalize(pair[1]) ~= shapes.normalize(pair[2]), pair[1])
            end
        end)
        test.it("rejects empty math matches while retaining content around math spacing", function()
            local chunks = { { ordinal = 1, content = "alpha" } }
            local bodies = { [1] = shapes.normalize("alpha") }
            local ctx = shapes.quote_context(chunks, "alpha")
            for _, quote in ipairs({ "$\\quad$", "$\\!$", "\\[\\hspace{2em}\\]" }) do
                test.eq(shapes.normalize(quote), "")
                test.is_nil((shapes.locate(quote, 1, bodies, { 1 })))
                test.is_nil((shapes.locate(quote, 1, bodies, { 1 }, ctx)))
            end
            test.eq(shapes.locate("al$\\quad$pha", 1, { [1] = "al pha" }, { 1 }), 1)
            local pair = context("alpha omega", "alpha", "omega", 7)
            test.eq((located("alpha$\\quad$omega", pair)), 1)
        end)
        test.it("bounds unmatched offset searches linearly in source length", function()
            for _, size in ipairs({ 512, 1024, 2048 }) do
                local comparisons, calls = 0, 0
                -- A string double counts each byte comparison in literal searches,
                -- including searches on slices, without relying on elapsed time.
                local function measured(text: string): any
                    return setmetatable({
                        find = function(_: any, needle: string, first: integer?, plain: boolean?): (integer?, integer?)
                            test.is_true(plain)
                            calls = calls + 1
                            for at = first or 1, #text - #needle + 1 do
                                local equal = true
                                for i = 1, #needle do
                                    comparisons = comparisons + 1
                                    if text:sub(at + i - 1, at + i - 1) ~= needle:sub(i, i) then equal = false; break end
                                end
                                if equal then return at, at + #needle - 1 end
                            end
                            return nil, nil
                        end,
                        sub = function(_: any, first: integer, last: integer?): any return measured(text:sub(first, last)) end,
                        gsub = function(_: any, pattern: string, replacement: string): string return (text:gsub(pattern, replacement)) end,
                    }, { __len = function(): integer return #text end })
                end
                local chunks = {}
                for i = 1, size // 8 do chunks[i] = { ordinal = i, content = "aaaaaaab" } end
                local positions, covered = shapes.source_positions(chunks, measured(string.rep("a", size)))
                test.is_nil(next(positions)); test.is_false(covered)
                test.is_true(comparisons <= 8 * size, "comparisons: " .. comparisons)
                test.is_true(calls <= size // 16, "search calls: " .. calls)
            end
        end)
        test.it("advances past missed windows and leaves distant or empty chunks without offsets", function()
            local positions = shapes.source_positions({ { ordinal = 1, content = "tail" } }, string.rep("a", 16) .. "tail")
            test.is_nil(positions[1])
            local chunks = { { ordinal = 1, content = "missing!" }, { ordinal = 2, content = "tail" }, { ordinal = 3, content = "" } }
            local covered
            positions, covered = shapes.source_positions(chunks, string.rep("a", 16) .. "tail")
            test.is_nil(positions[1]); test.is_nil(positions[3]); test.is_false(covered)
            test.eq(positions[2].first, 17); test.eq(positions[2].last, 20)
        end)
        test.it("keeps math commands literal inside code fences", function()
            local slash = string.char(92)
            for _, fence in ipairs({ "```", "~~~" }) do
                local source = fence .. "\ntext ``` $x" .. slash .. "quad y$\n" .. fence
                local changed = fence .. "\ntext ``` $x y$\n" .. fence
                test.is_true(shapes.normalize(source) ~= shapes.normalize(changed))
            end
        end)
        test.it("records literal source offsets sequentially without a splitter option", function()
            local lines = {}
            for i = 1, 80 do lines[i] = "Line " .. i .. " contains its own text and a repeated heading." end
            local source = table.concat(lines, "\n")
            for _, headings in ipairs({ false, true }) do
                for _, overlap in ipairs({ 0, 1, 20 }) do
                    local result = assert(process.chunk(source, { chunk_size = 100, overlap = overlap, split_headings = headings, keep_tables = true }))
                    test.is_true(#result.chunks > 1)
                    local previous_start, previous_end = 0, 0
                    for _, chunk in ipairs(result.chunks) do
                        test.not_nil(chunk.source_start); test.not_nil(chunk.source_end)
                        test.eq(source:sub(chunk.source_start, chunk.source_end), chunk.content)
                        test.is_true(chunk.source_start > previous_start); test.is_true(chunk.source_end > previous_end)
                        previous_start, previous_end = chunk.source_start, chunk.source_end
                    end
                end
            end
        end)
        test.it("roundtrips offsets and uses the last chunk's starting page when its end is absent", function()
            local owner = "owner-" .. uuid.v4()
            local ctx = context("alpha omega", "alpha", "omega", 7)
            local chunks = { ctx.chunks[1], ctx.chunks[2] }
            for i, c in ipairs(chunks) do
                c.section_id, c.heading_path, c.page_start = "s1", "Terms", i
                c.vector = {}; for j = 1, 512 do c.vector[j] = j == 1 and 1.0 or 0.0 end
            end
            local id = assert(store.save({ owner_id = owner, component_id = data.extractor(owner), upload_id = "upload-" .. uuid.v4(),
                checksum = "checksum", processing_key = "key", outline = {}, page_count = 2, tokens = 2, expires_at = "2999-01-01T00:00:00Z" }, chunks))
            local saved = assert(store.all_chunks(id))
            test.eq(saved[1].source_start, 1); test.eq(saved[2].source_end, 11)
            local run = { document = { id = id, source = ctx.source }, regions = {}, config = { fields = { field() },
                stages = { verify = { check_quotes = true, check_support = false } } }, values = {
                    { name = "total", path = "total", value = 1250, missing = false, failed = false,
                        evidence = { { chunk = 1, quote = "alpha omega" } } } } }
            test.is_nil(stages.verify(run, {})); test.is_true(run.values[1].verified)
            local quote = run.values[1].evidence[1]
            test.is_nil(quote.page); test.eq(quote.page_start, 1); test.eq(quote.page_end, 2)
        end)
    end)
end) }
