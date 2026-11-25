-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local catalog = require("catalog")
local preview = require("preview")

return {list_templates = catalog.list_templates, get_template = catalog.get_template, preview = preview.preview}
