-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local types = require("types")

local M = {}

function M.get(ex: types.Executor): (types.LiveState?, error?)
    local rows, err = ex:query("SELECT projected_seq,template_seq FROM mail_library_live WHERE id=1")
    if err then return nil, err end
    return rows[1] :: types.LiveState? or {projected_seq = 0, template_seq = 0}, nil
end

function M.lock(tx: types.Transaction, dialect: string): (types.LiveState?, error?)
    local _, err = tx:execute("INSERT INTO mail_library_live (id,projected_seq,template_seq) VALUES (1,0,0) ON CONFLICT (id) DO NOTHING")
    if err then return nil, err end
    if dialect == "sqlite" then return M.get(tx) end
    local rows, read_err = tx:query("SELECT projected_seq,template_seq FROM mail_library_live WHERE id=1 FOR UPDATE")
    if read_err then return nil, read_err end
    return rows[1] :: types.LiveState, nil
end

function M.advance(tx: types.Transaction, projected_seq: integer, template_seq: integer): (boolean?, error?)
    local _, err = tx:execute("UPDATE mail_library_live SET projected_seq=$1,template_seq=$2 WHERE id=1",
        {projected_seq, template_seq})
    if err then return nil, err end
    return true, nil
end

return M
