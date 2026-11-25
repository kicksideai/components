-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local resource = require("resource")
local library = require("library")

local M = {
    error = resource.error,
    key = resource.subject,
    check_key = resource.check_key,
    check_input_key = resource.check_input_key,
    check_filter = resource.check_filter,
    check_note = resource.check_note,
    check_content = resource.check_content,
    normalize = resource.normalize,
    names = resource.names,
    visible_messages = resource.visible_messages,
    MAX_EDITS = resource.MAX_EDITS,
    load = library.load,
    get = library.lookup,
}

return M
