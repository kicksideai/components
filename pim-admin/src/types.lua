-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local pim_types = require("pim_types")
local M = {}
type Map = { [string]: unknown }
type Catalog = { get_schema: (self: Catalog, Map) -> (unknown, error?),
    policy_defaults: (self: Catalog, { catalog_id: string }) -> (pim_types.Policy?, error?) }
type Directory = { resolve: (self: Directory, Map) -> (unknown, error?) }
M.Map = Map
M.Catalog = Catalog
M.Directory = Directory
return M
