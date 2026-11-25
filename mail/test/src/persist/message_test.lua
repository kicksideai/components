-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local db = require("db")
local reader = require("reader")
local repo = require("repo")
local test = require("test")
local uuid = require("uuid")

local function in_transaction(work)
    local rollback = errors.new({kind = errors.CONFLICT, message = "Roll back fixture rows",
        details = {code = "fixture_rollback"}})
    local value, err = db.with_tx(function(tx)
        work(tx)
        return nil, rollback
    end)
    test.is_nil(value)
    test.eq("fixture_rollback", assert(err):details().code)
end

return {run = test.run_cases(function()
    test.describe("Mail message repositories", function()
        test.it("returns the stored identity and hash when inserts share a sender and key", function()
            in_transaction(function(tx)
                local row = {id = uuid.v4(), created_at = 1, next_check_at = 2, sender = uuid.v4(),
                    actor_context = "test", from = {address = "mail@example.org"},
                    to = {"reader@example.org"}, subject = "Original", text = "Ready",
                    idempotency_scope = "sender:fixture", idempotency_key = uuid.v4(), content_hash = "original"}
                local inserted = assert(repo.insert(tx, row))
                test.is_true(inserted.inserted)
                test.eq(row.id, inserted.id)
                local job = uuid.v4()
                assert(repo.set_job(tx, row.id, job))
                assert(repo.finish(tx, row.id, job, 3, {delivered = {}}))

                local id = row.id
                row.id = uuid.v4()
                local replay = assert(repo.insert(tx, row))
                test.is_false(replay.inserted)
                test.eq(id, replay.id)
                test.eq("sent", replay.status)
                test.eq("original", replay.content_hash)

                row.content_hash = "different"
                row.subject = "Different"
                local collision = assert(repo.insert(tx, row))
                test.is_false(collision.inserted)
                test.eq(id, collision.id)
                test.eq("original", collision.content_hash)
                test.eq("Original", assert(reader.get(tx, id, row.sender)).subject)
                local absent, err = reader.get(tx, row.id, row.sender)
                test.is_nil(absent)
                test.eq(errors.NOT_FOUND, assert(err):kind())
                test.eq("message_not_found", err:details().code)
            end)
        end)

        test.it("pages recent sender groups with a missing origin", function()
            in_transaction(function(tx)
                local sender = uuid.v4()
                local origin = {kind = "module", id = "report", label = "Report"}
                local template = uuid.v4()
                for index = 1, 3 do
                    local id = uuid.v4()
                    local job = uuid.v4()
                    assert(repo.insert(tx, {id = id, created_at = 1, next_check_at = 2, sender = sender,
                        actor_context = "test", from = {address = "mail@example.org"},
                        to = {"reader@example.org"}, subject = "Notice", text = "Ready", template = template,
                        origin = index > 1 and origin or nil}))
                    assert(repo.set_job(tx, id, job))
                    assert(repo.finish(tx, id, job, 3, {delivered = {}}))
                end
                local first = assert(reader.recent_senders(tx, template, 1, 1))
                test.eq(1, #first.items)
                test.eq(2, first.items[1].count)
                test.eq(origin.id, first.items[1].origin.id)
                test.not_nil(first.next_cursor)
                local second = assert(reader.recent_senders(tx, template, 1, 1, first.next_cursor))
                test.eq(1, #second.items)
                test.eq(sender, second.items[1].sender)
                test.eq(1, second.items[1].count)
                test.is_nil(second.items[1].origin)
                test.is_nil(second.next_cursor)
            end)
        end)
    end)
end)}
