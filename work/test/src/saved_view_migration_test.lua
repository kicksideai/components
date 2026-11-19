-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local scoped = require("scoped")
local component = require("component")
local runner = require("runner")

local MIGRATION = "kickside.work.migrations:02_saved_view_boards"

local function data(reply)
    test.eq(reply.status, 200)
    test.is_true(reply.body.success)
    return reply.body.data
end

return { run = test.run_cases(function()
    test.describe("saved view board index migration", function()
        test.it("restores legacy personal and shared views through the migration runner", function()
            local owner, reader = scoped.admin(), scoped.member()
            local board = scoped.board(owner)
            assert(board.call("grant", { subject_id = reader.id, mask = 1 }))
            local function save(session, title, personal)
                local id = data(session.http("POST", session.route(board.id, "views"), {
                    title = title, personal = personal, view = { type = "list", columns = { "title" } },
                })).view_id
                -- Recreate the public metadata shape used before board-indexed listing.
                local ok, err = component.set_meta(id, {}, { trusted_runtime = true, delete_keys = { "board_id" } })
                assert(ok, tostring(err))
                return id
            end
            local function list(session, after)
                return data(session.http("POST", session.route(board.id, "list_views"), { limit = 1, after = after }))
            end
            local personal = save(reader, "Personal", true)
            local shared = save(owner, "Shared", false)
            test.eq(#list(reader).views, 0)

            local work_migrations = runner.setup("app:db")
            local options = { allowed_ids = { MIGRATION } }
            local reverted = work_migrations:rollback(options)
            test.eq(reverted.migrations_reverted, 1, tostring(reverted.error))
            local result = work_migrations:run_next(options)
            test.eq(result.migrations_applied, 1, tostring(result.error))
            test.eq(work_migrations:run_next(options).migrations_applied, 0)

            local first = list(reader)
            test.eq(first.views[1].view_id, personal)
            test.eq(first.views[1].title, "Personal")
            test.eq(first.views[1].view.columns[1], "title")
            test.not_nil(first.after)
            local second = list(reader, first.after)
            test.eq(second.views[1].view_id, shared)
            test.eq(second.views[1].title, "Shared")
            test.is_nil(second.after)
            local owners_page = list(owner)
            test.eq(owners_page.views[1].view_id, shared)
            test.is_nil(owners_page.after)
        end)
    end)
end) }
