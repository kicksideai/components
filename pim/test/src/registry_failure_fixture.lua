-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Registry responses for extension error-boundary tests.
local M = {}
local source: error? = nil
function M.set(err: error?)
    source = err
end
function M.get(_id: string): (unknown, error?)
    return nil, source
end
function M.find(_filter: unknown): ({ unknown }?, error?)
    return {}, source
end
return M
