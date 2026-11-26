-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local database = require("database")

local M = {}

function M.activate(tx: database.Transaction, upload_id: string, asset: string, seq: integer): (boolean?, error?)
    local _, err = tx:execute([[INSERT INTO mail_library_upload_ref (upload_id,asset,live,last_seq)
        VALUES ($1,$2,TRUE,$3) ON CONFLICT (upload_id) DO UPDATE SET
        asset=excluded.asset,live=excluded.live,last_seq=excluded.last_seq
        WHERE excluded.last_seq > mail_library_upload_ref.last_seq]], {upload_id, asset, seq})
    if err then return nil, err end
    return true, nil
end

function M.retire(tx: database.Transaction, upload_id: string, seq: integer): (boolean?, error?)
    local _, err = tx:execute("UPDATE mail_library_upload_ref SET live=FALSE WHERE upload_id=$1 AND last_seq=$2",
        {upload_id, seq})
    if err then return nil, err end
    return true, nil
end

function M.forget_retired(tx: database.Transaction, id: string): (boolean?, error?)
    local _, err = tx:execute("DELETE FROM mail_library_upload_ref WHERE upload_id=$1 AND live=FALSE", {id})
    if err then return nil, err end
    return true, nil
end

return M
