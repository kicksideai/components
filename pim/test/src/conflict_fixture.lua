-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The pipeline delivers one head conflict, then builds at the winning head.
local store = require("store")
local values = require("values")
local pipeline = require("pipeline")
local M = {}
type Attempt = pipeline.Attempt
M.Attempt = Attempt
local catalog_id = ""
local generation_changes = false
function M.configure(id: string, changed: boolean)
    catalog_id, generation_changes = id, changed
end
function M.run(command: pipeline.Command): (unknown, error?)
    local db, err = store.open()
    if err or not db then return nil, err end
    local catalog, cerr = store.catalog(db, catalog_id)
    db:release()
    if cerr or not catalog then return nil, cerr end
    local first, ferr = command.build(catalog.applied_seq)
    if ferr or not first then return nil, ferr end
    if generation_changes then
        local compiled = catalog.compiled
        compiled.attributes["ids.code"].config.length = 3
        local next_db, nerr = store.open()
        if nerr or not next_db then return nil, nerr end
        local _, uerr = next_db:execute("UPDATE kickside_pim_catalog SET generation = generation + 1, compiled = $1 WHERE catalog_id = $2",
            { values.canonical(compiled), catalog_id })
        next_db:release()
        if uerr then return nil, uerr end
    end
    local second, serr = command.build(catalog.applied_seq + 1)
    if serr or not second then return nil, serr end
    return second.result, nil
end
return M
