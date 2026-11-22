-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local read = require("read")
local M = {}
type Map = { [string]: unknown }
type Rule = { id: string, title: string, plugin: string, description: string?, reads: { string }? }
type BoardApp = { id: string, title: string }
type Catalog = { guards: { Rule }, scopes: { Rule }, board_apps: { BoardApp } }
type PluginOptions = read.PluginOptions
type Board = { get_schema: (self: Board, Map) -> (unknown, error?),
    schema_options: (self: Board, Map) -> (PluginOptions?, error?) }
type Directory = { resolve: (self: Directory, Map) -> (unknown, error?) }
M.Map = Map
M.Board = Board
M.Directory = Directory
M.Rule = Rule
M.Catalog = Catalog
M.PluginOptions = PluginOptions
return M
