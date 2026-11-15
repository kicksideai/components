-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Simulate a lost response after Core commits; the Work page must remain intact.
local threads = require("threads")
local store = require("store")
local M = {}
function M.retire(board_id: string, subjects: {string}): error?
    local db,err=store.open()
    if not db then return err end
    local _,setup_err=db:execute("CREATE TABLE IF NOT EXISTS app_work_retirement_retry (board_id TEXT PRIMARY KEY,phase INTEGER NOT NULL,names TEXT NOT NULL)",{})
    if setup_err then db:release();return setup_err end
    local present,perr=db:query("SELECT phase,names FROM app_work_retirement_retry WHERE board_id=$1",{board_id})
    db:release()
    if perr then return perr end
    local row=present and present[1]
    local rerr=threads.retire(board_id,subjects)
    if rerr then return rerr end
    if row and row.phase==0 then
        db,err=store.open()
        if not db then return err end
        local _,uerr=db:execute("UPDATE app_work_retirement_retry SET phase=1,names=$1 WHERE board_id=$2",{store.encode(subjects),board_id})
        db:release()
        if uerr then return uerr end
        return errors.new({kind=errors.UNAVAILABLE,message="fixture lost retirement response",retryable=true})
    elseif row and row.phase==1 then
        if row.names~=store.encode(subjects) then return errors.new({kind=errors.INTERNAL,message="retirement retry changed exact names"}) end
        db,err=store.open()
        if not db then return err end
        local _,uerr=db:execute("UPDATE app_work_retirement_retry SET phase=2 WHERE board_id=$1",{board_id})
        db:release()
        if uerr then return uerr end
    end
    return nil
end
return M
