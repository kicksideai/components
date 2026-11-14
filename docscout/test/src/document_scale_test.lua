-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local process = require("process")
local shapes = require("shapes")
local time = require("time")

return { run = test.run_cases(function()
    test.describe("Document-scale text", function()
        test.it("preserves every section and line of a multi-megabyte document within ten seconds", function()
            local bodies, lines = {}, {}
            for section = 1, 24 do
                local body = { "# Section " .. section, "long " .. string.rep("x", 120000) .. " end " .. section }
                for line = 1, 250 do body[#body + 1] = "line " .. section .. ":" .. line .. " " .. string.rep("word ", 20) .. "end" end
                bodies[#bodies + 1] = table.concat(body, "\n")
                for _, line in ipairs(body) do lines[#lines + 1] = line end
            end
            local markdown = table.concat(bodies, "\n")
            test.is_true(#markdown > 3 * 1024 * 1024)
            local started = time.now()
            local sections = process.sections(markdown)
            test.eq(#sections, #bodies)
            for i, section in ipairs(sections) do
                test.eq(section.title, "Section " .. i)
                test.eq(section.text, bodies[i])
            end
            local split = shapes.lines(markdown)
            test.eq(#split, #lines)
            for i, line in ipairs(lines) do test.eq(split[i], line) end
            local document = assert(process.chunk(markdown, { chunk_size = 50000, overlap = 0, split_headings = true, keep_tables = true }))
            test.eq(#document.outline, #bodies)
            local present = {}
            for _, chunk in ipairs(document.chunks) do
                for line in shapes.each_line(chunk.content) do present[line] = true end
            end
            local normalized = {}
            for _, line in ipairs(lines) do
                test.is_true(present[line], "missing source line: " .. line:sub(1, 70))
                normalized[#normalized + 1] = shapes.normalize(line)
            end
            test.eq(shapes.normalize(markdown), table.concat(normalized, " "))
            test.is_true(time.now():sub(started):seconds() < 10, "document processing exceeds ten seconds")
        end)
        test.it("preserves long headings, trailing whitespace and emphasis runs", function()
            local title = string.rep("title ", 24000) .. "end"
            local spaces = string.rep(" ", 120000)
            local sections = process.sections("# " .. title .. spaces .. "###\nbody" .. spaces)
            test.eq(#sections, 1)
            test.eq(sections[1].title, title)
            test.eq(shapes.trim("text" .. spaces), "text")
            test.eq(shapes.normalize_literal("text" .. string.rep("*", 120000) .. " end"), "text end")
            test.eq(shapes.normalize_literal(string.rep("*", 120000)), string.rep("*", 120000))
        end)
        test.it("normalizes long runs of typographic replacements within ten seconds", function()
            local started = time.now()
            test.eq(shapes.normalize_literal(string.rep("—", 120000)), string.rep("-", 120000))
            test.is_true(time.now():sub(started):seconds() < 10, "typography normalization exceeds ten seconds")
        end)
        test.it("normalizes a multi-megabyte math span within ten seconds", function()
            local body = string.rep("x", 3 * 1024 * 1024)
            local started = time.now()
            test.eq(shapes.normalize("$" .. body .. "\\quad end$"), "$" .. body .. " end$")
            test.is_true(time.now():sub(started):seconds() < 10, "math normalization exceeds ten seconds")
        end)
        test.it("scans repeated inline code without rescanning the suffix within ten seconds", function()
            local body = string.rep("`x` ", 750000)
            local started = time.now()
            test.eq(shapes.normalize(body), shapes.normalize_literal(body))
            test.is_true(time.now():sub(started):seconds() < 10, "inline code scan exceeds ten seconds")
        end)
        test.it("scans unmatched spacing braces within ten seconds", function()
            local body = "$" .. string.rep("\\hspace{", 15000) .. "$"
            local started = time.now()
            test.eq(shapes.normalize(body), body)
            test.is_true(time.now():sub(started):seconds() < 10, "spacing brace scan exceeds ten seconds")
        end)
        test.it("scans unmatched math delimiters within ten seconds", function()
            local body = string.rep("\\(", 1000000)
            local started = time.now()
            test.eq(shapes.normalize(body), body)
            test.is_true(time.now():sub(started):seconds() < 10, "unmatched math scan exceeds ten seconds")
        end)
        test.it("scans backslash runs within ten seconds", function()
            local body = string.rep("\\", 120000) .. "(x\\quad y)"
            local started = time.now()
            test.eq(shapes.normalize(body), body)
            test.is_true(time.now():sub(started):seconds() < 10, "escape scan exceeds ten seconds")
        end)
        test.it("scans nonfence prefixes within ten seconds", function()
            local body = string.rep("x~~~ ", 200000)
            local started = time.now()
            test.eq(shapes.normalize(body), shapes.trim(body))
            test.is_true(time.now():sub(started):seconds() < 10, "fence prefix scan exceeds ten seconds")
        end)
        test.it("scans distinct unmatched tick runs within ten seconds", function()
            local runs = {}
            for n = 1, 2200 do runs[n] = "x" .. string.rep("`", n) end
            local body = table.concat(runs, " ")
            local started = time.now()
            test.eq(shapes.normalize(body), shapes.normalize_literal(body))
            test.is_true(time.now():sub(started):seconds() < 10, "unmatched tick scan exceeds ten seconds")
        end)
        test.it("assigns whole-document chunks to their first matching section within ten seconds", function()
            local sections = {}
            for n = 1, 12000 do
                sections[n] = "# Section " .. n .. "\nrow " .. n .. " " .. string.rep("word ", 80)
            end
            local started = time.now()
            local document = assert(process.chunk(table.concat(sections, "\n"),
                { chunk_size = 110, overlap = 0, split_headings = false, keep_tables = true }))
            for _, chunk in ipairs(document.chunks) do
                local probe, owner = chunk.content:sub(1, 80), nil
                local number = probe:match("^# Section (%d+)\n") or probe:match("^row (%d+) ")
                if number then owner = "Section " .. number end
                if owner then test.eq(chunk.heading_path, owner) end
            end
            test.is_true(time.now():sub(started):seconds() < 10, "chunk ownership exceeds ten seconds")
        end)
        test.it("retains literal math in code after a long code span", function()
            local literal = string.rep("x", 120000)
            local markdown = "```\n" .. literal .. "\n```\n`$x\\quad y$`\n$x\\quad y$"
            test.eq(shapes.normalize(markdown), literal .. " $x\\quad y$ $x y$")
        end)
    end)
end) }
