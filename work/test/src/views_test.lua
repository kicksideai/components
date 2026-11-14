-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local scoped = require("scoped")
local steps = require("steps")
local function define()
    test.describe("saved work views", function()
        test.it("lets a personal owner rename through the contract and save a title with board READ", function()
            local owner, reader = scoped.admin(), scoped.member()
            local h = scoped.board(owner)
            assert(h.call("grant", { subject_id = reader.id, mask = 1 }))
            local id = assert(reader.call("create_view", { board_id = h.id, personal = true, title = "Before", view = { type = "list" } })).view_id
            test.eq(assert(reader.call("rename_view", { view_id = id, title = "Renamed" })).view_id, id)
            local get = reader.http("GET", "/api/work/views/" .. id)
            test.eq(get.status, 200)
            test.eq(get.body.data.title, "Renamed")
            local saved = reader.http("POST", "/api/work/views/" .. id .. "/save", { title = "Saved title", view = { type = "list", columns = { "estimate" } } })
            test.eq(saved.status, 200)
            get = reader.http("GET", "/api/work/views/" .. id)
            test.eq(get.body.data.title, "Saved title")
            test.eq(get.body.data.view.columns[1], "estimate")
            local listed = reader.http("POST", "/" .. h.id .. "/list_views", {})
            test.eq(listed.body.data.views[1].title, "Saved title")
        end)

        test.it("reserves shared view rename and delete for board ADMIN independently of WRITE", function()
            local owner, writer, admin, reader = scoped.admin(), scoped.member(), scoped.member(), scoped.member()
            local h = scoped.board(owner)
            for _, pair in ipairs({ { writer, 3 }, { admin, 9 }, { reader, 1 } }) do
                assert(h.call("grant", { subject_id = pair[1].id, mask = pair[2] }))
            end
            local id = assert(writer.call("create_view", { board_id = h.id, title = "Shared", view = { type = "list" } })).view_id
            for _, member in ipairs({ writer, reader }) do
                for _, request in ipairs({ { "POST", "/rename", { title = "Refused" } }, { "DELETE", "", {} } }) do
                    local denied = member.http(request[1], "/api/work/views/" .. id .. request[2], request[3])
                    test.eq(denied.status, 403)
                    test.eq(denied.body.details.code, "access_denied")
                end
            end
            local denied = writer.http("POST", "/api/work/views/" .. id .. "/save", { title = "Refused", view = { type = "list", columns = { "estimate" } } })
            test.eq(denied.status, 403)
            local get = writer.http("GET", "/api/work/views/" .. id)
            test.eq(get.body.data.title, "Shared")
            test.is_nil(get.body.data.view.columns)
            assert(writer.call("save_view", { view_id = id, view = { type = "list", columns = { "estimate" } } }))
            local renamed = admin.http("POST", "/api/work/views/" .. id .. "/rename", { title = "Admin title" })
            test.eq(renamed.status, 200)
            test.eq(writer.http("GET", "/api/work/views/" .. id).body.data.title, "Admin title")
            local deletion = admin.http("DELETE", "/api/work/views/" .. id)
            test.eq(deletion.status, 200)
            test.is_true(deletion.body.data.deleted or deletion.body.data.in_progress)
            steps.deleted(id)
            test.eq(writer.http("GET", "/api/work/views/" .. id).status, 403)
            test.eq(#writer.http("POST", "/" .. h.id .. "/list_views", {}).body.data.views, 0)
        end)

        test.it("lets owners and board ADMIN delete personal views without granting their definitions", function()
            local owner, reader, other, admin = scoped.admin(), scoped.member(), scoped.member(), scoped.member()
            local h = scoped.board(owner)
            for _, pair in ipairs({ { reader, 1 }, { other, 3 }, { admin, 9 } }) do
                assert(h.call("grant", { subject_id = pair[1].id, mask = pair[2] }))
            end
            for _, actor in ipairs({ reader, admin }) do
                local id = assert(reader.call("create_view", { board_id = h.id, personal = true, view = { type = "list" } })).view_id
                test.eq(admin.http("GET", "/api/work/views/" .. id).status, 403)
                test.eq(other.http("DELETE", "/api/work/views/" .. id).status, 403)
                if actor == admin then
                    test.eq(admin.http("POST", "/api/work/views/" .. id .. "/rename", { title = "Admin rename" }).status, 200)
                    test.eq(reader.http("GET", "/api/work/views/" .. id).body.data.title, "Admin rename")
                end
                local deletion = assert(actor.call("delete_view", { view_id = id }))
                test.eq(deletion.view_id, id)
                test.is_true(deletion.deleted or deletion.in_progress)
                steps.deleted(id)
                local _, err = reader.call("run_view", { view_id = id })
                test.eq(err:kind(), errors.PERMISSION_DENIED)
            end
        end)

        test.it("allows the owner or board ADMIN to rename and delete without board READ", function()
            local owner, holder, admin = scoped.admin(), scoped.member(), scoped.member()
            local h = scoped.board(owner)
            assert(h.call("grant", { subject_id = holder.id, mask = 1 }))
            assert(h.call("grant", { subject_id = admin.id, mask = 8 }))
            local personal = assert(holder.call("create_view", { board_id = h.id, personal = true, view = { type = "list" } })).view_id
            local shared = assert(owner.call("create_view", { board_id = h.id, view = { type = "list" } })).view_id
            assert(h.call("revoke", { subject_id = holder.id }))
            for _, pair in ipairs({ { holder, personal }, { admin, shared } }) do
                local actor, id = pair[1], pair[2]
                test.eq(actor.http("GET", "/api/work/views/" .. id).status, 403)
                test.eq(actor.http("POST", "/api/work/views/" .. id .. "/rename", { title = "Managed" }).status, 200)
                test.eq(actor.http("DELETE", "/api/work/views/" .. id).status, 200)
                steps.deleted(id)
            end
        end)

        test.it("rejects invalid titles and definitions before changing a saved view", function()
            local owner = scoped.admin()
            local h = scoped.board(owner)
            local id = assert(owner.call("create_view", { board_id = h.id, title = "Original", view = { type = "list" } })).view_id
            for _, title in ipairs({ "", "   ", 42 }) do
                test.eq(owner.http("POST", "/api/work/views/" .. id .. "/rename", { title = title }).status, 400)
                test.eq(owner.http("POST", "/api/work/views/" .. id .. "/save", { title = title, view = { type = "list", columns = { "estimate" } } }).status, 400)
            end
            test.eq(owner.http("POST", "/api/work/views/" .. id .. "/save", { title = "Rejected", view = { type = "list", columns = { "missing" } } }).status, 400)
            local get = owner.http("GET", "/api/work/views/" .. id)
            test.eq(get.body.data.title, "Original")
            test.is_nil(get.body.data.view.columns)
            test.eq(owner.http("POST", "/api/work/views/" .. h.id .. "/rename", { title = "Wrong kind" }).status, 403)
            test.eq(owner.http("DELETE", "/api/work/views/" .. h.id).status, 403)
        end)

        test.it("saves a shared view and runs actor operands as the current viewer", function()
            local admin, member = scoped.admin(), scoped.member()
            local h = scoped.board(admin)
            local mine = steps.create(h, "story", { assignee = { kind = "user", id = admin.id } })
            local theirs = steps.create(h, "story", { assignee = { kind = "user", id = member.id } })
            assert(h.call("grant", { subject_id = member.id, mask = 1 }))
            local created = admin.http("POST", "/" .. h.id .. "/views", { title = "Mine", view = { type = "list", where = { field = "assignee", op = "eq", value = { ["$actor"] = "id" } }, columns = { "assignee" } } })
            test.eq(created.status, 200)
            local id = created.body.data.view_id
            test.eq(assert(admin.call("get_meta", {}, id)).meta.owner, h.id)
            local a = assert(admin.call("run_view", { view_id = id }))
            local b = assert(member.call("run_view", { view_id = id }))
            test.eq(a.items[1].id, mine)
            test.eq(b.items[1].id, theirs)
            local context = assert(admin.call("attachment_context", { id = id }))
            test.is_nil(context.execution_identity)
            test.is_nil(context.actor)
            test.eq(context._execution_identity.principal.id, admin.id)
        end)

        test.it("keeps personal views at root and validates saved trees and presentation", function()
            local admin, member = scoped.admin(), scoped.member()
            local h = scoped.board(admin)
            assert(h.call("grant", { subject_id = member.id, mask = 1 }))
            local created = assert(member.call("create_view", { board_id = h.id, personal = true, view = { type = "list" } }))
            local meta = assert(member.call("get_meta", {}, created.view_id))
            test.is_nil(meta.parent_id)
            local _, denied = admin.call("run_view", { view_id = created.view_id })
            test.not_nil(denied)
            local _, invalid = member.call("save_view", { view_id = created.view_id, view = { type = "list", where = { field = "missing", op = "eq", value = 1 } } })
            test.not_nil(invalid)
            test.eq(invalid:kind(), errors.INVALID)
            for _, view in ipairs({ { type = "list", group_by = "state" }, { type = "list", order = { { field = "state" }, { field = "rank" } } } }) do
                assert(member.call("save_view", { view_id = created.view_id, view = view }))
                local out, err = member.call("run_view", { view_id = created.view_id })
                test.is_nil(err)
                test.not_nil(out)
                if view.group_by then test.not_nil(out.groups) end
            end
        end)
    end)
end
return { run = test.run_cases(define) }
