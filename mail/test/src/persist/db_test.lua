-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry = require("registry")
local funcs = require("funcs")
local test = require("test")
local fixtures = require("fixtures")
local api_fixtures = require("api_fixtures")
local database = require("database")
local delivery_wait = require("delivery_wait")

local function install_link_fault()
    return assert(database.with_db(function(db, dialect)
        if dialect == "postgres" then
            assert(db:execute([[CREATE FUNCTION refuse_fixture_job_link() RETURNS trigger LANGUAGE plpgsql
                AS $$ BEGIN RETURN NULL; END $$]]))
            assert(db:execute([[CREATE TRIGGER refuse_fixture_job_link BEFORE UPDATE OF job_id ON mail_message
                FOR EACH ROW WHEN (NEW.subject = 'Fixture rollback') EXECUTE FUNCTION refuse_fixture_job_link()]]))
        else
            assert(db:execute([[CREATE TRIGGER refuse_fixture_job_link BEFORE UPDATE OF job_id ON mail_message
                WHEN NEW.subject = 'Fixture rollback' BEGIN SELECT RAISE(IGNORE); END]]))
        end
        return function()
            assert(database.with_db(function(db)
                if dialect == "postgres" then
                    assert(db:execute("DROP TRIGGER refuse_fixture_job_link ON mail_message"))
                    return db:execute("DROP FUNCTION refuse_fixture_job_link()")
                end
                return db:execute("DROP TRIGGER refuse_fixture_job_link")
            end))
        end
    end))
end

return {run = test.run_cases(function()
    test.describe("Mail database", function()
        test.it("reports an unset target database as an internal configuration error", function()
            local entry = assert(registry.get("kickside.mail:db_config"))
            local owner = "app.mail_persist:db_config_test"
            local changes = assert(registry.overlay(owner)):changes()
            entry.meta.db_id = ""
            assert(changes:update(entry))
            assert(changes:apply())

            local value, err = fixtures.mailer(fixtures.editor(), "preview", {
                template = "notice", vars = {subject = "Status", message = "Ready"},
            })
            local cleanup = assert(registry.overlay(owner)):changes()
            assert(cleanup:delete(entry.id))
            assert(cleanup:apply())

            test.is_nil(value)
            test.eq(errors.INTERNAL, assert(err):kind())
            test.eq("mail_db_unconfigured", err:details().code)
        end)

        local cleanup
        test.after_each(function()
            if not cleanup then return end
            cleanup()
            cleanup = nil
            api_fixtures.settings("", "")
        end)

        test.it("rolls back the message and releases the handle for the next send", function()
            local member = api_fixtures.session("sender")
            local sender = assert(funcs.new():with_actor(member.actor):with_scope(member.scope))
            api_fixtures.settings("app.mail_harness:capture", "mail@example.org")
            cleanup = install_link_fault()
            local value, err = fixtures.mailer(sender, "send", {
                to = {"reader@example.org"}, subject = "Fixture rollback", text = "Ready",
            })
            test.is_nil(value)
            test.eq(errors.INTERNAL, assert(err):kind())
            test.eq("mail_job_link_missing", err:details().code)
            test.eq(0, assert(fixtures.mailer(sender, "list_messages", {limit = 1})).total)
            local queued = assert(fixtures.mailer(sender, "send", {
                to = {"reader@example.org"}, subject = "After rollback", text = "Ready",
            }))
            local delivered = delivery_wait.terminal(function()
                return fixtures.mailer(sender, "get_message", queued.message_id)
            end, "25s")
            test.eq("sent", delivered.status)
        end)
    end)
end)}
