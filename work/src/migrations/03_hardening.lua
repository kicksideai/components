-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- Published 01/02 up paths remain unchanged. This upgrade adds age-indexed
-- feed retention and durable, page-resumable process recovery for existing boards.
local jobs=require("jobs")
local clock=require("clock")
local function drain(db,statement)
    while true do
        local rows,err=db:query(statement,{})
        if err then error(errors.wrap(err,"Work retained-payload upgrade failed")) end
        if #rows<100 then return end
    end
end
local function execute(db,statement,params)
    local _,err=db:execute(statement,params or {})
    if err then error(errors.wrap(err,"Work hardening upgrade failed")) end
end
return require("migration").define(function()
    migration("03 hardening recovery and retention",function()
        for _,dialect in ipairs({"sqlite","postgres"}) do
            database(dialect,function()
                up(function(db)
                    local columns,err
                    if dialect=="sqlite" then columns,err=db:query("SELECT name FROM pragma_table_info('kickside_work_visibility') WHERE name='at'",{})
                    else columns,err=db:query("SELECT column_name FROM information_schema.columns WHERE table_schema=current_schema() AND table_name='kickside_work_visibility' AND column_name='at'",{}) end
                    if err then error(err) end
                    if #columns==0 then execute(db,"ALTER TABLE kickside_work_visibility ADD COLUMN at text NOT NULL DEFAULT ''") end
                    execute(db,"UPDATE kickside_work_visibility SET at=$1 WHERE at=''",{clock.now()})
                    execute(db,"CREATE INDEX IF NOT EXISTS kickside_work_visibility_age ON kickside_work_visibility (board_id,at,seq)")
                    execute(db,"CREATE INDEX IF NOT EXISTS kickside_work_comment_deleted ON kickside_work_comment (board_id,edited_at) WHERE deleted=1")
                    execute(db,"CREATE INDEX IF NOT EXISTS kickside_work_comment_page ON kickside_work_comment (board_id,item_id,deleted,comment_id)")
                    -- Released tombstones discarded their authorization inputs. Retire
                    -- their audit instead of inferring permission from an empty document.
                    drain(db,[[DELETE FROM kickside_work_change WHERE (board_id,seq,n) IN (
                        SELECT c.board_id,c.seq,c.n FROM kickside_work_change c JOIN kickside_work_item i
                        ON i.board_id=c.board_id AND c.subject=('i:' || i.item_id) WHERE i.life='purged'
                        ORDER BY c.board_id,c.seq,c.n LIMIT 100) RETURNING seq]])
                    drain(db,[[DELETE FROM kickside_work_interval WHERE (board_id,item_id,field_id,start_seq) IN (
                        SELECT v.board_id,v.item_id,v.field_id,v.start_seq FROM kickside_work_interval v JOIN kickside_work_item i
                        ON i.board_id=v.board_id AND i.item_id=v.item_id WHERE i.life='purged'
                        ORDER BY v.board_id,v.item_id,v.field_id,v.start_seq LIMIT 100) RETURNING start_seq]])
                    drain(db,[[UPDATE kickside_work_comment SET body='',mentions='[]' WHERE (board_id,comment_id) IN (
                        SELECT board_id,comment_id FROM kickside_work_comment WHERE deleted=1 AND (body<>'' OR mentions<>'[]')
                        ORDER BY board_id,comment_id LIMIT 100) RETURNING comment_id]])
                    local after=""
                    while true do
                        local boards,berr=db:query("SELECT board_id FROM kickside_work_board WHERE board_id>$1 ORDER BY board_id LIMIT 100",{after})
                        if berr then error(berr) end
                        for _,board in ipairs(boards) do
                            -- A fixed retry policy avoids a live Settings dependency
                            -- while migrations hold their database transaction.
                            local job,jerr=jobs.enqueue_tx(db,dialect,{namespace="kickside.work",scope=board.board_id,key="recovery",
                                owner_locator={kind="component",id=board.board_id},job_type="kickside.work.jobs:recovery",max_attempts=3,immutable_payload={board_id=board.board_id}})
                            if jerr then error(jerr) end
                            execute(db,[[INSERT INTO kickside_work_job (board_id,job_id,job_type,key,status)
                                VALUES ($1,$2,'recovery','{"phase":"items","after":""}','pending')
                                ON CONFLICT (board_id,job_id) DO NOTHING]],{board.board_id,job.id})
                            after=board.board_id
                        end
                        if #boards<100 then break end
                    end
                end)
                down(function(db)
                    -- Recovery is forward-only; removing indexes needs no data rewrite.
                    execute(db,"DROP INDEX IF EXISTS kickside_work_visibility_age")
                    execute(db,"DROP INDEX IF EXISTS kickside_work_comment_deleted")
                    execute(db,"DROP INDEX IF EXISTS kickside_work_comment_page")
                end)
            end)
        end
    end)
end)
