-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local uuid = require("uuid")
local M = {}
function M.declaration(): { [string]: unknown }
    return {
        key_prefix = "W" .. (uuid.v4()):gsub("-", ""):upper():sub(1, 8),
        fields = { { code = "title", form = "text", index = "key" } },
        item_types = { { id = "task", process = "delivery", fields = { "title" } } },
        processes = { { id = "delivery", initial = "todo", states = {
            { id = "todo", name = "To do", category = "unstarted" }, { id = "done", name = "Done", category = "completed" },
        }, transitions = { { id = "finish", from = { "todo" }, to = "done" } } } },
    }
end
return M
