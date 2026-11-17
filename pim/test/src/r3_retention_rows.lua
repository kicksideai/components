-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Isolate the review's eleven-catalog installation from unrelated suite fixtures.
local rows=require("rows")
local M={}
M.orphan_receipts=rows.orphan_receipts
M.global_deadline=rows.global_deadline
M.position=rows.position
M.advance=rows.advance
M.trashed=rows.trashed
M.deadline=rows.deadline
M.Tombstone=rows.Tombstone
M.tombstones=rows.tombstones
M.prune_tombstones=rows.prune_tombstones
M.prune_publications=rows.prune_publications
function M.catalogs(db,position,limit)
    return db:query([[SELECT catalog_id,compiled,retention_after FROM kickside_pim_catalog
        WHERE (catalog_id>$1 OR (catalog_id=$1 AND $2=1)) AND catalog_id LIKE 'r3-protected-%'
        ORDER BY catalog_id LIMIT $3]],{position.catalog_id,position.inclusive,limit})
end
return M
