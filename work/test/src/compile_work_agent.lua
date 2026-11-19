-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local compiler = require("compiler")
local M = {}
type Map = { [string]: unknown }
function M.run(input: Map): (unknown, error?)
    local traits = {
        { id = "kickside.work.traits:work_admin", context = { board_id = input.board_id } },
    }
    if not input.admin_only then
        table.insert(traits, 1, { id = "kickside.work.traits:work", context = { board_id = input.board_id } })
    end
    local result, err = compiler.compile({ id = "work-agent", traits = traits })
    if err then return nil, errors.new({ kind = errors.INTERNAL, message = err, details = { code = "compile_failed" } }) end
    return result, nil
end
return M
