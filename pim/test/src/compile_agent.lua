-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Compile under the calling principal with the platform compiler.
local compiler = require("compiler")
local M = {}
function M.run(spec: { [string]: unknown }): unknown
    local compiled, err = compiler.compile(spec)
    assert(compiled, tostring(err))
    return compiled
end
return M
