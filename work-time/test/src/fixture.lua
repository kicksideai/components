-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Reference Work board schema for the Work Time suites.
local uuid = require("uuid")
local json = require("json")

local M = {}

M.DECLARATION = {
    key_prefix = "ENG",
    fields = {
        { code = "title", form = "text", track = true },
        { code = "estimate", form = "int", index = "number", track = true },
        { code = "assignee", type = "principal", index = "key", track = true },
        { code = "labels", form = "text", cardinality = "set" },
        { code = "priority", type = "option", options = { { id = "p0", label = "Urgent", order = 1 }, { id = "p4", label = "None", order = 9 } },
          index = "number", track = true },
        { code = "number", type = "counter" },
    },
    item_types = {
        { id = "epic", title = "Epic", process = "delivery", parent_types = {}, fields = { "title", "assignee", "priority", "number" } },
        { id = "story", title = "Story", process = "delivery", parent_types = { false, "epic" },
          fields = { "title", "assignee", "priority", "estimate", "labels", "number" }, inherit = { "priority" } },
        { id = "task", title = "Task", process = "delivery", parent_types = { false, "story", "task" }, fields = { "title", "estimate", "labels" } },
    },
    relation_types = {
        { id = "blocks", outward = "blocks", inward = "blocked by" },
        { id = "relates", outward = "relates to", inward = "relates to", symmetric = true },
        { id = "duplicates", outward = "duplicates", inward = "duplicated by", cardinality = "one" },
    },
    processes = {
        { id = "delivery", initial = "open", states = { { id = "open", name = "Open", category = "started" } } },
    },
}

type Call = (string, unknown) -> (unknown, error?)
type Handle = { id: string, prefix: string, call: Call }
M.Handle = Handle

-- fresh_prefix is an item key prefix no other board holds; prefixes are unique per installation.
function M.fresh_prefix(): string
    local hex = (uuid.v4()):gsub("-", ""):upper():sub(1, 8)
    return "W" .. hex
end

-- declaration returns the reference declaration under a key prefix, with a deep copy so tests may edit it.
function M.declaration(prefix: string): { [string]: unknown }
    local copy = json.decode(json.encode(M.DECLARATION)) :: { [string]: unknown }
    copy.key_prefix = prefix
    return copy
end

return M
