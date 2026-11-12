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
            for _, line in ipairs(lines) do
                local present = false
                for _, chunk in ipairs(document.chunks) do
                    if chunk.content:find(line, 1, true) then present = true; break end
                end
                test.is_true(present, "missing source line: " .. line:sub(1, 70))
            end
            local normalized = shapes.normalize(markdown)
            for _, line in ipairs(lines) do
                test.is_true(normalized:find(shapes.normalize(line), 1, true) ~= nil, "missing normalized line")
            end
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
        test.it("retains literal math in code after a long code span", function()
            local literal = string.rep("x", 120000)
            local markdown = "```\n" .. literal .. "\n```\n`$x\\quad y$`\n$x\\quad y$"
            test.eq(shapes.normalize(markdown), literal .. " $x\\quad y$ $x y$")
        end)
    end)
end) }
