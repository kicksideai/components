-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local fixture = require("fixture")
local store = require("store")
local materializer = require("materializer")
local uuid = require("uuid")
local types = require("types")
local json = require("json")
local M = {}
type Map = { [string]: unknown }
function M.catalog(h: fixture.Handle): types.Catalog
    local db = assert(store.open())
    local c = assert(store.catalog(db, h.id))
    db:release()
    return c
end

function M.footwear_own(size_level: { string }, gtin: string?, weight: string?): types.FamilyDecl
    local family = json.decode((json.encode(fixture.DECLARATION.families[1]))) :: types.FamilyDecl
    family.variation[2].own = size_level
    family.requirements[1].require[2] = gtin or "core.gtin"
    family.requirements[2].require = { gtin or "core.gtin", weight or "logistics.net_weight" }
    return family
end

function M.kind(err: unknown): string?
    if err == nil then return nil end
    return (err :: error):kind()
end

function M.fold(h: fixture.Handle, events: { types.RawEvent }, to_seq: integer, budget: integer): (materializer.FoldResult?, error?)
    local db = assert(store.open())
    local tx = assert(db:begin())
    local out, err = materializer.fold(tx, db:type(), h.id, events, to_seq, budget)
    tx:rollback()
    db:release()
    return out, err
end

function M.export(call: fixture.Call): (Map, string)
    local path = "export-" .. uuid.v4()
    local out, err = call("portable", { method = "export", args = { storage_id = "app:exports", path = path } })
    assert(not err, tostring(err))
    return out :: Map, path
end

function M.import(call: fixture.Call, path: string, id_map: Map?): Map
    local out, err = call("portable", { method = "import_into", args = { storage_id = "app:exports", path = path, id_map = id_map or {} } })
    assert(not err, tostring(err))
    return out :: Map
end

function M.count_rows(statement: string, params: { unknown }): integer
    local db = assert(store.open())
    local rows = assert(db:query(statement, params))
    db:release()
    return math.tointeger(tonumber(rows[1].n)) :: integer
end


return M
