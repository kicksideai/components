-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local M = {}
type Map = { [string]: unknown }
type Board = { get_schema: (self: Board, Map) -> (unknown, error?), schema_options: (self: Board, Map) -> (Map?, error?) }
type Directory = { resolve: (self: Directory, Map) -> (unknown, error?) }
type FieldTypeOption = { id: string, title: string }
M.Map = Map
M.Board = Board
M.Directory = Directory
M.FieldTypeOption = FieldTypeOption
return M
