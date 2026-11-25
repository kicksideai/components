-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local asset_file_repo = require("asset_file_repo")
local database = require("database")
local policy = require("policy")
local reader = require("message_reader")
local repo = require("message_repo")
local time = require("time")
local types = require("types")

local M = {OWNER_KIND = "mail-message", WORKER = "kickside.mail.outbox:deliver"}

function M.start(id: string, job_id: string, driver_id: string?): (types.MessageRow?, error?)
    return database.with_db(function(ex: types.Executor): (types.MessageRow?, error?)
        return repo.start(ex, id, job_id, driver_id)
    end)
end

function M.finish(tx: types.Transaction, id: string, job_id: string, now: integer,
    delivered: types.TransportResult?, cause: types.MessageError?): (boolean?, error?)
    local changed, err = repo.finish(tx, id, job_id, now, {delivered = delivered, cause = cause})
    if err then return nil, err end
    if changed and delivered then
        local _, detach_err = asset_file_repo.detach(tx, id, time.now():unix_nano() // 1000000)
        if detach_err then return nil, detach_err end
    end
    return changed, nil
end

function M.rearm(tx: types.Transaction, row: types.MessageRow, next_at: integer,
    cause: types.MessageError): (boolean?, error?)
    return repo.rearm(tx, row.id, row.job_id, next_at, next_at + policy.RECHECK_MS, cause)
end

function M.content(row: types.MessageRow): (types.Addresses?, {types.AttachmentRef}?, error?)
    local content, err = reader.content(row)
    if err then return nil, nil, err end
    return content.addresses, content.attachments, nil
end

function M.asset_refs(id: string): ({types.AssetRef}?, error?)
    return database.with_db(function(ex: types.Executor): ({types.AssetRef}?, error?)
        return asset_file_repo.refs(ex, id)
    end)
end

return M
