-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local fixture = require("fixture")

type Map = { [string]: unknown }

local function declaration(): Map
    return {
        key_prefix = fixture.fresh_prefix(),
        fields = {
            { code = "points", form = "int", track = true }, { code = "cost", form = "dec" },
            { code = "title", form = "text" }, { code = "due", form = "time" },
            { code = "priority", type = "option", options = { { id = "low", order = 2 }, { id = "high", order = 7 } } },
            { code = "count", type = "rollup", form = "int", of = "children", fn = "count" },
            { code = "total", type = "rollup", form = "int", of = "children", fn = "sum", field = "points" },
            { code = "costs", type = "rollup", form = "dec", of = "children", fn = "sum", field = "cost" },
            { code = "minimum", type = "rollup", form = "int", of = "children", fn = "min", field = "priority" },
            { code = "maximum", type = "rollup", form = "int", of = "children", fn = "max", field = "points" },
            { code = "average", type = "rollup", form = "dec", of = "children", fn = "avg", field = "points" },
            { code = "first", type = "rollup", form = "time", of = "children", fn = "earliest", field = "due" },
            { code = "last", type = "rollup", form = "time", of = "children", fn = "latest", field = "due" },
            { code = "done", type = "rollup", form = "dec", of = "children", fn = "percent_done" },
            { code = "recent", type = "rollup", form = "text", of = "children", fn = "latest_of", field = "title", by = "time" },
            { code = "ranked", type = "rollup", form = "text", of = "children", fn = "latest_of", field = "title", by = "rank" },
            { code = "related", type = "rollup", form = "int", of = "blocks", fn = "sum", field = "points" },
            { code = "symmetric", type = "rollup", form = "int", of = "relates", fn = "count" },
        },
        item_types = { { id = "parent", process = "work", fields = { "count", "total", "costs", "minimum", "maximum", "average", "first", "last", "done", "recent", "ranked", "related", "symmetric" } },
            { id = "child", process = "work", parent_types = { "parent" }, fields = { "points", "cost", "title", "due", "priority", "symmetric" } } },
        relation_types = { { id = "blocks" }, { id = "relates", symmetric = true } },
        processes = { { id = "work", initial = "todo", states = { { id = "todo", category = "started" }, { id = "shipped", category = "completed" },
            { id = "dropped", category = "canceled" } }, transitions = { { id = "finish", from = "any", to = "shipped" }, { id = "cancel", from = "any", to = "dropped" } } } },
    }
end

return { declaration = declaration }
