-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Copies the locked kickside/widgets bundle into the UI browser fixture, so
-- fixture pages mount the shared widgets the module runs with.
local fs = require("fs")
local io = require("io")

local function volume(id: string): any
    local vol, err = fs.get(id)
    assert(vol, tostring(err))
    return vol
end

local function copy(source: any, target: any, path: string): integer
    local copied = 0
    local iter, state = source:readdir(path)
    for item in iter, state do
        local child = path == "/" and item.name or path .. "/" .. item.name
        if item.type == "directory" then
            if not target:exists(child) then assert(target:mkdir(child)) end
            copied = copied + copy(source, target, child)
        else
            assert(target:writefile(child, assert(source:readfile(child))))
            copied = copied + 1
        end
    end
    return copied
end

local function main(): integer
    local copied = copy(volume("kickside.widgets:ui_fs"), volume("app:widgets_fixture"), "/")
    io.print("Copied " .. copied .. " widget files into the UI fixture")
    return 0
end

return { main = main }
