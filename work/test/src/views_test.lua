-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local scoped = require("scoped")
local steps = require("steps")
local fixture = require("fixture")
local function define()
    test.describe("saved work views", function()
        test.it("runs an explicit board selection through the cross-board cursor", function()
            local owner, viewer = scoped.admin(), scoped.member()
            local anchor, source, other = scoped.board(owner), scoped.board(owner), scoped.board(owner)
            for _, board in ipairs({ anchor, source, other }) do
                assert(board.call("grant", { subject_id = viewer.id, mask = 1 }))
            end
            local home = steps.create(anchor, "task", { estimate = 0 })
            local first = steps.create(source, "task", { estimate = 1 })
            local second = steps.create(other, "task", { estimate = 2 })
            local view = { type = "list", boards = { source.id, other.id }, order = { field = "estimate" }, columns = { "title", "estimate" } }
            local id = assert(owner.call("create_view", { board_id = anchor.id, view = view })).view_id
            local path = "/api/work/views/" .. id
            local get = viewer.http("GET", path)
            test.eq(get.status, 200)
            test.eq(get.body.data.board_id, anchor.id)
            test.eq(get.body.data.view.boards[1], source.id)
            local page = viewer.http("POST", path .. "/run", { limit = 1 })
            test.eq(page.status, 200)
            test.eq(page.body.data.items[1].id, first)
            local cursor = page.body.data.cross_after
            test.not_nil(cursor)
            test.eq(viewer.http("POST", path .. "/run", { cross_after = cursor, after = { id = first } }).status, 400)
            test.eq(viewer.http("POST", path .. "/run", { after = { id = first } }).status, 400)
            test.eq(viewer.http("POST", path .. "/run", { min_seq = 0 }).status, 400)
            test.eq(owner.http("POST", path .. "/run", { cross_after = cursor }).status, 400)
            page = viewer.http("POST", path .. "/run", { limit = 1, cross_after = cursor })
            test.eq(page.status, 200)
            test.eq(page.body.data.items[1].id, second)
            test.is_nil(page.body.data.cross_after)

            local schema = fixture.declaration(other.prefix)
            schema.fields[#schema.fields + 1] = { code = "detail", form = "text" }
            schema.item_types[3].fields[#schema.item_types[3].fields + 1] = "detail"
            assert(other.call("apply_schema", { declaration = schema }))
            test.eq(viewer.http("POST", path .. "/run", { cross_after = cursor }).status, 400)
            cursor = assert(viewer.call("run_view", { view_id = id, limit = 1 })).cross_after
            test.not_nil(cursor)

            view.boards = { other.id }
            assert(owner.call("save_view", { view_id = id, view = view }))
            test.eq(viewer.http("POST", path .. "/run", { cross_after = cursor }).status, 400)
            test.eq(assert(viewer.call("run_view", { view_id = id })).items[1].id, second)
            view.boards = nil
            assert(owner.call("save_view", { view_id = id, view = view }))
            test.is_nil(assert(viewer.call("get_view", { view_id = id })).view.boards)
            test.eq(assert(viewer.call("run_view", { view_id = id, min_seq = 0 })).items[1].id, home)
        end)

        test.it("returns a private placeholder in the anchor list when selected board access is revoked", function()
            local owner, viewer = scoped.admin(), scoped.member()
            local anchor, selected = scoped.board(owner), scoped.board(owner)
            for _, board in ipairs({ anchor, selected }) do
                assert(board.call("grant", { subject_id = viewer.id, mask = 1 }))
            end
            local view = { type = "list", boards = { selected.id }, columns = { "estimate" }, where = { field = "estimate", op = "eq", value = 782 } }
            local id = assert(owner.call("create_view", { board_id = anchor.id, title = "Private selection", view = view })).view_id
            assert(owner.call("create_view", { board_id = anchor.id, view = { type = "list" } }))
            local shown = assert(viewer.call("list_views", { board_id = anchor.id, limit = 1 }))
            test.eq(shown.views[1].view.boards[1], selected.id)
            assert(selected.call("revoke", { subject_id = viewer.id }))
            local path = "/api/work/views/" .. id
            for _, response in ipairs({ viewer.http("GET", path), viewer.http("POST", path .. "/run", {}) }) do
                test.eq(response.status, 403)
                test.eq(response.body.details.code, "access_denied")
                test.is_nil(response.body.details.board_id)
                local leaked = response.raw:find(selected.id, 1, true)
                test.is_nil(leaked)
            end
            local listed = assert(viewer.call("list_views", { board_id = anchor.id, limit = 1 }))
            local entry = listed.views[1]
            test.eq(entry.view_id, id)
            test.eq(entry.board_id, anchor.id)
            test.eq(entry.status, "unavailable")
            test.is_nil(entry.title)
            test.is_nil(entry.view)
            test.eq(listed.after, shown.after)
            test.not_nil(assert(viewer.call("list_views", { board_id = anchor.id, after = listed.after })).views[1].view)
        end)

        test.it("resolves readable boards as the viewer and invalidates a changed expansion", function()
            local owner, viewer = scoped.admin(), scoped.member()
            local anchor, selected = scoped.board(owner), scoped.board(owner)
            assert(anchor.call("grant", { subject_id = viewer.id, mask = 1 }))
            local home = steps.create(anchor, "task", { estimate = 1 })
            steps.create(anchor, "task", { estimate = 2 })
            local next_item = steps.create(selected, "task", { estimate = 3 })
            local id = assert(owner.call("create_view", { board_id = anchor.id, view = { type = "list", boards = "readable", order = { field = "estimate" } } })).view_id
            local page = assert(viewer.call("run_view", { view_id = id, limit = 1 }))
            test.eq(page.items[1].id, home)
            test.not_nil(page.cross_after)
            test.eq(#page.cross_after.selection, 1)
            assert(selected.call("grant", { subject_id = viewer.id, mask = 1 }))
            local stale = viewer.http("POST", "/api/work/views/" .. id .. "/run", { cross_after = page.cross_after })
            test.eq(stale.status, 400)
            test.eq(assert(viewer.call("get_view", { view_id = id })).view.boards, "readable")
            page = assert(viewer.call("run_view", { view_id = id }))
            test.eq(page.items[3].id, next_item)
        end)

        test.it("admits filters, columns, scopes and sort on every selected board before saving", function()
            local owner, reader, writer = scoped.admin(), scoped.member(), scoped.member()
            local anchor = scoped.board(owner)
            local d = fixture.declaration(fixture.fresh_prefix())
            d.fields[2] = { code = "estimate", form = "time", index = "key" }
            local other = scoped.board(owner, d)
            assert(anchor.call("apply_schema", { declaration = {
                plugins = { { use = "app:work_plugin" } }, scopes = { "app:work_scope" },
            } }))
            assert(anchor.call("grant", { subject_id = reader.id, mask = 1 }))
            assert(anchor.call("grant", { subject_id = writer.id, mask = 2 }))
            assert(other.call("grant", { subject_id = writer.id, mask = 1 }))
            local shared = assert(writer.call("create_view", { board_id = anchor.id, view = { type = "list", boards = { other.id } } })).view_id
            assert(other.call("grant", { subject_id = reader.id, mask = 1 }))
            test.eq(assert(reader.call("get_view", { view_id = shared })).view.boards[1], other.id)
            assert(other.call("revoke", { subject_id = reader.id }))
            local id = assert(reader.call("create_view", { board_id = anchor.id, personal = true, view = { type = "list" } })).view_id
            local path = "/api/work/views/" .. id
            local view = { type = "list", boards = { anchor.id, other.id } }
            test.eq(reader.http("POST", path .. "/save", { view = view }).status, 403)
            assert(other.call("grant", { subject_id = reader.id, mask = 1 }))
            for _, options in ipairs({
                { columns = { "estimate" } },
                { where = { field = "estimate", op = "eq", value = 5 } },
                { order = { field = "estimate" } },
                { order = { { field = "number" }, { field = "rank" } } },
                { group_by = "state" },
            }) do
                options.type, options.boards = view.type, view.boards
                local response = reader.http("POST", path .. "/save", { view = options })
                test.eq(response.status, 400, response.raw)
            end
            local _, scope_err = owner.call("create_view", { board_id = anchor.id, view = {
                type = "list", boards = { anchor.id, other.id }, scopes = { { id = "app:work_scope" } },
            } })
            test.eq(scope_err:kind(), errors.INVALID)
            test.eq(scope_err:details().code, "plugin_seam_unowned")
            local ids: { string } = {}
            for i = 1, 51 do ids[i] = tostring(i) end
            test.eq(reader.http("POST", path .. "/save", { view = { type = "list", boards = ids } }).status, 400)
            test.is_nil(assert(reader.call("get_view", { view_id = id })).view.boards)
            view.boards = { other.id }
            assert(reader.call("save_view", { view_id = id, view = view }))
            test.eq(assert(reader.call("get_view", { view_id = id })).view.boards[1], other.id)
            assert(anchor.call("revoke", { subject_id = reader.id }))
            test.eq(reader.http("POST", path .. "/run", {}).status, 403)
            test.eq(reader.http("GET", path).status, 403)
        end)

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
            local record = assert(writer.call("get_meta", {}, id))
            test.eq(record.parent_id, h.id)
            test.eq(record.meta.owner, h.id)
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

        test.it("continues a saved view by group key as its viewer", function()
            local admin, member = scoped.admin(), scoped.member()
            local h = scoped.board(admin)
            local parent = steps.create(h, "task")
            local child = steps.create(h, "task", {}, parent)
            steps.create(h, "task", {}, parent)
            assert(h.call("grant", { subject_id = member.id, mask = 1 }))
            local id = assert(admin.call("create_view", { board_id = h.id, view = {
                type = "list", group_by = "parent", order = { field = "number" },
            } })).view_id
            local page = assert(member.call("run_view", { view_id = id, group_limit = 1, limit = 1 }))
            test.eq(#page.groups, 1)
            test.eq(page.groups[1].value, parent)
            test.eq(page.groups[1].count, 2)
            test.eq(page.groups[1].items[1].id, child)
            test.not_nil(page.groups[1].after)
            test.not_nil(page.group_after)
            page = assert(member.call("run_view", { view_id = id, group_limit = 1, limit = 1, group_after = page.group_after }))
            test.eq(#page.groups, 1)
            test.is_nil(page.groups[1].value)
            test.eq(page.groups[1].count, 1)
            test.is_nil(page.group_after)
        end)

        test.it("continues the item page of a saved grouped view as its viewer", function()
            local admin, member = scoped.admin(), scoped.member()
            local h = scoped.board(admin)
            local first = steps.create(h, "task", { estimate = 5 })
            local second = steps.create(h, "task", { estimate = 5 })
            local third = steps.create(h, "task", { estimate = 1 })
            assert(h.call("grant", { subject_id = member.id, mask = 1 }))
            local id = assert(admin.call("create_view", { board_id = h.id, view = { type = "list" } })).view_id
            assert(admin.call("save_view", { view_id = id, view = {
                type = "list", group_by = "state", sub_group_by = "estimate",
                order = { { field = "estimate", dir = "desc" }, { field = "number" } },
            } }))
            local page = assert(member.call("run_view", { view_id = id, limit = 1 }))
            test.eq(page.groups[1].count, 3)
            local group = page.groups[1].groups[2]
            test.eq(group.value, 5)
            test.eq(group.count, 2)
            test.eq(group.items[1].id, first)
            test.not_nil(group.after)
            test.eq(page.items[1].id, first)
            page = assert(member.call("run_view", { view_id = id, limit = 1, after = page.after }))
            test.eq(page.items[1].id, second)
            page = assert(member.call("run_view", { view_id = id, limit = 1, after = page.after }))
            test.eq(page.items[1].id, third)
            test.is_nil(page.after)
        end)

        test.it("counts saved view subgroups and continues a filtered detail view as the viewer", function()
            local owner, reader = scoped.admin(), scoped.member()
            local h = scoped.board(owner)
            local first = steps.create(h, "task", { estimate = 1 })
            local second = steps.create(h, "task", { estimate = 1 })
            local third = steps.create(h, "task", { estimate = 2 })
            assert(h.call("grant", { subject_id = reader.id, mask = 1 }))
            local id = assert(reader.call("create_view", { board_id = h.id, personal = true, view = { type = "list" } })).view_id
            local order = { { field = "estimate" }, { field = "number", dir = "desc" } }
            assert(reader.call("save_view", { view_id = id, view = {
                type = "list", group_by = "state", sub_group_by = "estimate", order = order,
            } }))
            local page = assert(reader.call("run_view", { view_id = id, limit = 1 }))
            test.eq(#page.groups, 1)
            local group = page.groups[1]
            test.eq(group.count, 3)
            test.eq(#group.groups, 2)
            test.eq(group.groups[1].count, 2)
            test.eq(group.groups[1].items[1].id, second)
            test.not_nil(group.groups[1].after)
            test.eq(group.groups[2].count, 1)
            test.eq(group.groups[2].items[1].id, third)
            local detail = assert(reader.call("create_view", { board_id = h.id, personal = true, view = {
                type = "list", where = { field = "estimate", op = "eq", value = 1 }, order = order,
            } })).view_id
            local next_page = assert(reader.call("run_view", { view_id = detail, limit = 1, after = group.groups[1].after }))
            test.eq(#next_page.items, 1)
            test.eq(next_page.items[1].id, first)
            test.is_nil(next_page.after)
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
