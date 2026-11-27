-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local funcs = require("funcs")
local registry = require("registry")
local sql = require("sql")
local api_fixtures = require("api_fixtures")
local delivery_wait = require("delivery_wait")
local library_fixtures = require("library_fixtures")

local PART = "realtime-failed-broadcast"
local FAULT = "fixture.refuse_library"

return {run = test.run_cases(function()
    test.describe("Mail realtime", function()
        test.after_each(function()
            local db = assert(sql.get("app:db"))
            assert(db:execute("DELETE FROM mail_realtime_fixture WHERE topic=$1 AND subject=$2", {FAULT, PART}))
            assert(db:release())
            library_fixtures.remove({{kind = "part", name = PART}})
        end)

        test.it("commits the library write when the realtime binding refuses the broadcast", function()
            local binding = assert(registry.get("app.mail_realtime:realtime_binding"))
            test.is_true(binding.data.contracts[1].default)
            test.is_nil((registry.get("kickside.realtime:realtime_binding")))
            local editor = api_fixtures.session("editor_sender")
            local executor = assert(funcs.new():with_actor(editor.actor):with_scope(editor.scope))
            local part = {kind = "part", name = PART, title = "Realtime fixture", description = "",
                html = "<p>Fixture</p>", text = "Fixture", schema = {type = "object", properties = {}}, samples = {}}
            local preview = assert(executor:call("kickside.mail.traits:library_preview", {message = "notice", create = part}))
            part.preview_id = assert(preview.preview_id, preview.error)

            local db = assert(sql.get("app:db"))
            assert(db:execute("INSERT INTO mail_realtime_fixture (topic,subject,data,observed) VALUES ($1,$2,$3,$4)",
                {FAULT, PART, "{}", "uncalled"}))
            assert(db:release())
            local wait_for_refusal = delivery_wait.observe("library_refused", "8s")
            local receipt = assert(executor:call("kickside.mail.traits:library_create", part))
            local observed = wait_for_refusal(function()
                local db = assert(sql.get("app:db"))
                local rows = assert(db:query("SELECT observed FROM mail_realtime_fixture WHERE topic=$1 AND subject=$2",
                    {FAULT, PART}))
                assert(db:release())
                return rows[1].observed
            end, function(value) return value ~= "uncalled" end)
            library_fixtures.await_live(assert(receipt.seq))
            local saved = assert(library_fixtures.call(executor, "get", {kind = part.kind, name = PART}))
            test.eq(PART, saved.name)
            test.is_true(saved.revision > 0)

            library_fixtures.await_sync_idle()
            test.eq("done", assert(library_fixtures.sync_job(saved.seq)).status)
            test.eq(tostring(saved.revision), observed)
        end)
    end)
end)}
