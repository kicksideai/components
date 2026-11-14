-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local scoped = require("scoped")
local steps = require("steps")
local attachment_rows = require("attachment_rows")
local attachments = require("attachments")
local sql = require("sql")
local function define()
    test.describe("component configuration", function()
        test.it("authorizes a second board administrator through live board grants", function()
            local owner, other = scoped.admin(), scoped.admin()
            local h = scoped.board(owner)
            assert(h.call("apply_schema", { declaration = { plugins = { { use = "app:work_plugin" } } } }))
            local attachment = assert(h.call("get_schema", {})).plugins[1].attachment_id
            assert(h.call("grant", { subject_id = other.id, mask = 15 }))
            local configured, err = other.call("configure_plugin", { plugin = "app:work_plugin", config = { threshold = 12 } }, h.id)
            test.is_nil(err, steps.detail(err))
            test.eq(configured.attachment_id, attachment)
            test.eq(assert(other.call("get_schema", {}, h.id)).plugins[1].config.threshold, 12)
            assert(h.call("revoke", { subject_id = other.id }))
            local out, refused = other.call("configure_plugin", { plugin = "app:work_plugin", config = { threshold = 13 } }, h.id)
            test.is_nil(out)
            test.eq(refused:kind(), errors.PERMISSION_DENIED)
            test.is_nil((other.call("get_schema", {}, h.id)))
        end)
        test.it("refuses attachment association mismatches before configuration or deletion", function()
            local admin = scoped.admin()
            local h = scoped.board(admin)
            local other = scoped.board(admin)
            local plugin = "app:work_plugin"
            assert(h.call("apply_schema", { declaration = { plugins = { { use = plugin } } }, plugin_configs = { [plugin] = { threshold = 3 } } }))
            local attachment = assert(h.call("get_schema", {})).plugins[1].attachment_id
            steps.wait_for("initial attachment lifecycle", function(): boolean return assert(h.call("get_schema", {})).plugins[1].lifecycle.state == "ready" end)
            local original = assert(admin.call("attachment_context", { id = attachment }))
            local db = assert(sql.get("app:db"))
            local held = assert(db:query("SELECT impl_id, revision, applied_revision FROM kickside_work_plugin WHERE board_id = $1 AND plugin = $2", { h.id, plugin }))[1]
            db:release()
            for _, active in ipairs({ 1, 0 }) do
                for _, mismatch in ipairs({ "implementation", "board", "plugin" }) do
                    local desired_board = mismatch == "board" and other.id or h.id
                    local desired_plugin = mismatch == "plugin" and "app:other_plugin" or plugin
                    local desired_impl = mismatch == "implementation" and "app:other_attachment" or held.impl_id
                    local db = assert(sql.get("app:db"))
                    assert(db:execute("UPDATE kickside_work_plugin SET board_id = $1, plugin = $2, impl_id = $3, active = $4, revision = revision + 1 WHERE board_id = $5 AND plugin = $6",
                        { desired_board, desired_plugin, desired_impl, active, h.id, plugin }))
                    db:release()
                    local row = { attachment_id = attachment, plugin = desired_plugin, impl_id = desired_impl, config = original.config,
                        active = active == 1, revision = held.revision + 1, applied_revision = held.applied_revision, lifecycle = { state = "pending" } }
                    local err
                    if active == 1 then err = attachments.ensure(desired_board, row) else err = attachments.remove(desired_board, row) end
                    local db = assert(sql.get("app:db"))
                    local pending = assert(db:query("SELECT applied_revision FROM kickside_work_plugin WHERE board_id = $1 AND plugin = $2", { desired_board, desired_plugin }))[1]
                    assert(db:execute("UPDATE kickside_work_plugin SET board_id = $1, plugin = $2, impl_id = $3, active = 1, revision = $4 WHERE board_id = $5 AND plugin = $6",
                        { h.id, plugin, held.impl_id, held.revision, desired_board, desired_plugin }))
                    db:release()
                    test.not_nil(err, mismatch)
                    test.eq(err:kind(), errors.CONFLICT, mismatch)
                    test.eq(err:details().code, "attachment_mismatch", mismatch)
                    test.eq(pending.applied_revision, held.applied_revision, mismatch)
                    local context = assert(admin.call("attachment_context", { id = attachment }))
                    test.eq(context.board_id, original.board_id)
                    test.eq(context.plugin, original.plugin)
                    test.eq(context.config.threshold, original.config.threshold)
                    test.eq(assert(admin.call("get_meta", {}, attachment)).meta.owner, h.id)
                end
            end
        end)
        test.it("keeps plugin configuration writable after a keyed unchanged schema receipt", function()
            local h = scoped.board(scoped.admin())
            assert(h.call("apply_schema", { declaration = { plugins = { { use = "app:work_plugin" } } } }))
            local before = assert(h.call("get_schema", {})).generation
            local schemas = 0
            for _, event in ipairs(steps.events(h)) do if event.type == "kickside.work.events:schema.applied" then schemas = schemas + 1 end end
            local result = assert(h.call("apply_schema", { declaration = {}, key = "unchanged-config" }))
            test.eq(result.class, "unchanged")
            test.eq(result.generation, before)
            local after = 0
            for _, event in ipairs(steps.events(h)) do if event.type == "kickside.work.events:schema.applied" then after = after + 1 end end
            test.eq(after, schemas)
            test.not_nil(assert(h.call("configure_plugin", { plugin = "app:work_plugin", config = { threshold = 7 } })))
        end)
        test.it("versions plugin activation creates its attachment and reserves configured events", function()
            local admin, member = scoped.admin(), scoped.member()
            local h = scoped.board(admin)
            local plan, perr = h.call("plan_schema", { declaration = { plugins = { { use = "app:work_plugin" } } }, plugin_configs = { ["app:work_plugin"] = { threshold = 3 } } })
            test.is_nil(perr, steps.detail(perr))
            test.not_nil(plan)
            test.eq(assert(h.call("get_schema", {})).generation, 1)
            assert(h.call("apply_schema", { declaration = { plugins = { { use = "app:work_plugin" } } }, plugin_configs = { ["app:work_plugin"] = { threshold = 3 } } }))
            local schema = assert(h.call("get_schema", {}))
            test.eq(schema.declaration.plugins[1].use, "app:work_plugin")
            test.is_nil(schema.declaration.plugins[1].config)
            test.is_nil(schema.compiled.plugins[1].config)
            local attachment = schema.plugins[1].attachment_id
            test.not_nil(attachment)
            steps.wait_for("attachment configuration", function(): boolean return assert(h.call("get_schema", {})).plugins[1].lifecycle.state == "ready" end)
            local context = assert(admin.call("attachment_context", { id = attachment }))
            test.eq(context.config.threshold, 3)
            local meta = assert(admin.call("get_meta", {}, attachment)).meta
            test.eq(meta.owner, h.id)
            assert(h.call("configure_plugin", { plugin = "app:work_plugin", config = { threshold = 8 }, trace_context = { trace_id = "configuration-trace", run_id = "configuration-run" } }))
            steps.wait_for("updated attachment configuration", function(): boolean return assert(h.call("get_schema", {})).plugins[1].lifecycle.state == "ready" end)
            context = assert(admin.call("attachment_context", { id = attachment }))
            test.eq(context.config.threshold, 8)
            local _, schema_edit = h.call("apply_schema", { declaration = { plugins = { { use = "app:work_plugin" } } }, plugin_configs = { ["app:work_plugin"] = { threshold = 9 } } })
            test.not_nil(schema_edit)
            test.eq(schema_edit:details().code, "plugin_config_requires_attachment")
            local events = steps.events(h)
            test.eq(events[#events].type, "kickside.work.events:plugin.configured")
            test.eq(events[#events].body.config.threshold, 8)
            test.eq(events[#events].trace_context.trace_id, "configuration-trace")
            test.is_nil(events[#events].body.credentials)
            local history = assert(h.call("list_history", {})).entries
            test.eq(history[1].kind, "plugin")
            test.eq(history[1].after.config.threshold, 8)
            assert(h.call("grant", { subject_id = member.id, mask = 3 }))
            local _, err = member.call("append", { thread_id = h.id, events = { { type = "kickside.work.events:plugin.configured", subject = "plugin:app:work_plugin", body = { plugin = "app:work_plugin", config = {} } } } }, h.id)
            test.not_nil(err)
            test.eq(err:kind(), errors.PERMISSION_DENIED)
            assert(h.call("apply_schema", { declaration = { plugins = {} } }))
            local absent = assert(h.call("get_schema", {}))
            for _, plugin in ipairs(absent.plugins) do test.eq(plugin.active, false) end
            steps.wait_for("removed attachment", function(): boolean
                local missing, missing_err = admin.call("attachment_context", { id = attachment })
                return missing == nil and missing_err ~= nil
            end)
        end)

        test.it("refuses unknown ungranted and malformed activation and unlisted query seams", function()
            local h = scoped.board(scoped.admin())
            for _, plugin in ipairs({ "app:missing_plugin", "app:hidden_plugin" }) do
                local out, err = h.call("apply_schema", { declaration = { plugins = { { use = plugin } } } })
                test.is_nil(out)
                test.not_nil(err)
                test.eq(err:kind(), plugin == "app:hidden_plugin" and errors.PERMISSION_DENIED or errors.INVALID)
            end
            local _, err = h.call("apply_schema", { declaration = { plugins = { { use = "app:work_plugin" } } }, plugin_configs = { ["app:work_plugin"] = { threshold = "bad" } } })
            test.not_nil(err)
            test.eq(err:kind(), errors.INVALID)
            local _, qerr = h.call("query", { scopes = { { id = "app:work_scope" } } })
            test.not_nil(qerr)
            test.eq(qerr:kind(), errors.INVALID)
            test.eq(qerr:details().code, "plugin_seam_unowned")
        end)

        test.it("resolves activated scopes and refuses removal while a stored seam uses them", function()
            local admin = scoped.admin()
            local h = scoped.board(admin)
            assert(h.call("apply_schema", { declaration = { plugins = { { use = "app:work_plugin" } }, scopes = { "app:work_scope" } } }))
            local page = assert(h.call("query", { scopes = { { id = "app:work_scope" } } }))
            test.eq(#page.items, 0)
            local explain = assert(h.call("explain", { scopes = { { id = "app:work_scope" } } }))
            test.eq(explain.scopes[1], "app:work_scope")
            local _, err = h.call("apply_schema", { declaration = { plugins = {} } })
            test.not_nil(err)
            test.eq(err:details().code, "plugin_seam_in_use")
            assert(h.call("apply_schema", { declaration = { plugins = {}, scopes = {} } }))
        end)

        test.it("admits declared field seams only while their plugin is active", function()
            local h = scoped.board(scoped.admin())
            local declaration = { plugins = { { use = "app:work_plugin" } }, fields = { { code = "external", type = "app:work_type", index = "number" } },
                item_types = { { id = "task", process = "delivery", fields = { "title", "estimate", "external" }, parent_types = { "task" } } } }
            local _, denied = h.call("apply_schema", { declaration = { fields = declaration.fields } })
            test.not_nil(denied)
            test.eq(denied:details().code, "plugin_seam_unowned")
            assert(h.call("apply_schema", { declaration = declaration }))
            local item = steps.create(h, "task", { external = 4 })
            test.eq(assert(h.call("query", { where = { field = "external", op = "eq", value = 4 } })).items[1].id, item)
            local _, removal = h.call("apply_schema", { declaration = { plugins = {} } })
            test.not_nil(removal)
            test.eq(removal:details().code, "plugin_seam_in_use")
        end)

        test.it("reaps the board-owned plugin attachment through component deletion", function()
            local admin = scoped.admin()
            local h = scoped.board(admin)
            assert(h.call("apply_schema", { declaration = { plugins = { { use = "app:work_plugin" } } } }))
            local attachment = assert(h.call("get_schema", {})).plugins[1].attachment_id
            steps.wait_for("owned attachment lifecycle", function(): boolean return assert(h.call("get_schema", {})).plugins[1].lifecycle.state == "ready" end)
            attachment_rows.seed(attachment)
            test.eq(attachment_rows.count(attachment), 1)
            test.not_nil(assert(h.call("delete", {})))
            steps.deleted(h.id)
            steps.wait_for("owned attachment reaper", function(): boolean
                local context, err = admin.call("attachment_context", { id = attachment })
                return context == nil and err ~= nil
            end)
            test.eq(attachment_rows.count(attachment), 0)
        end)

        test.it("reads app defaults through settings and keeps board policy over them", function()
            local admin = scoped.admin()
            test.is_true(assert(admin.call("set_setting", { namespace = "kickside.work", key = "trash_days", value = 30 })).success)
            local h = scoped.board(admin)
            local schema = assert(h.call("get_schema", {}))
            test.eq(schema.compiled.policy.trash_days, 30)
            assert(h.call("apply_schema", { declaration = { policy = { trash_days = 7 } } }))
            test.eq(assert(h.call("get_schema", {})).compiled.policy.trash_days, 7)
            assert(admin.call("unset_setting", { namespace = "kickside.work", key = "trash_days" }))
        end)
    end)
end
return { run = test.run_cases(define) }
