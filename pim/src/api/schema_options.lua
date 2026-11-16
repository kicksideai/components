-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- GET /pim/catalogs/{id}/schema/options - the types, scopes, plugins and link kinds a schema may name.
local access = require("access")

local function handler()
    access.read("schema_options", {})
end

return { handler = handler }
