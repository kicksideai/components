-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local work = require("work")
local M = {}
type Map = { [string]: unknown }
type FieldTypeOption = work.FieldTypeOption
type PluginOption = { plugin: string, installed: boolean, problem: unknown? }
type SchemaOptions = { plugins: { PluginOption }, field_types: { FieldTypeOption } }
type Board = { get_schema: (self: Board, Map) -> (unknown, error?), schema_options: (self: Board, Map) -> (SchemaOptions?, error?) }
type Directory = { resolve: (self: Directory, Map) -> (unknown, error?) }
M.Map = Map
M.Board = Board
M.Directory = Directory
M.SchemaOptions = SchemaOptions
return M
