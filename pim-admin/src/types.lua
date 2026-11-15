-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = {}
type Map = { [string]: unknown }
type Catalog = { get_schema: (self: Catalog, Map) -> (unknown, error?) }
type Directory = { resolve: (self: Directory, Map) -> (unknown, error?) }
type Settings = { get_namespace: (self: Settings, Map) -> (Map?, error?) }
M.Settings = Settings
M.Map = Map
M.Catalog = Catalog
M.Directory = Directory
return M
