-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local funcs = require("funcs")
local M = {}
function M.read(args: unknown): (unknown, error?) return funcs.call("kickside.work.traits:get_schema", args) end
function M.write(args: unknown): (unknown, error?) return funcs.call("kickside.work.traits:apply", args) end
return M
