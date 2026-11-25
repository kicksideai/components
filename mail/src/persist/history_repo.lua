-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local sql = require("sql")
local types = require("types")

local M = {}

function M.insert(tx: types.Transaction, row: types.HistoryRow): (boolean?, error?)
    local _, err = tx:execute([[INSERT INTO mail_library_history
        (seq,kind,name,version,action,author,note,restored_from,at)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (seq) DO NOTHING]],
        {row.seq, row.kind, row.name, row.version, row.action, row.author, row.note or sql.NULL,
            row.restored_from or sql.NULL, row.at})
    if err then return nil, err end
    return true, nil
end

return M
