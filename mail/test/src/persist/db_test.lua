-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local db = require("db")
local registry = require("registry")
local test = require("test")
local uuid = require("uuid")

return {run = test.run_cases(function()
    test.describe("Mail database", function()
        test.it("reports an unset target database as an internal configuration error", function()
            local entry = assert(registry.get("kickside.mail:db_config"))
            local overlay = assert(registry.overlay("app.mail_persist:db_config_test"))
            local changes = overlay:changes()
            entry.meta.db_id = ""
            assert(changes:update(entry))
            assert(changes:apply())

            local value, err = db.db_id()
            local cleanup = assert(registry.overlay("app.mail_persist:db_config_test")):changes()
            assert(cleanup:delete(entry.id))
            assert(cleanup:apply())

            test.is_nil(value)
            test.eq(errors.INTERNAL, assert(err):kind())
            test.eq("mail_db_unconfigured", err:details().code)
        end)

        test.it("rolls back a failed callback and releases the database handle", function()
            local upload_id = uuid.v4()
            local refused = errors.new({kind = errors.CONFLICT, message = "Refused test write",
                details = {code = "mail_db_test_refused"}})
            local value, err = db.with_tx(function(tx, dialect)
                if dialect ~= "sqlite" and dialect ~= "postgres" then
                    return nil, errors.new({kind = errors.INTERNAL, message = "Unexpected SQL dialect: " .. dialect})
                end
                local _, write_err = tx:execute("INSERT INTO mail_asset_file (upload_id) VALUES ($1)", {upload_id})
                if write_err then return nil, write_err end
                return nil, refused
            end)
            test.is_nil(value)
            test.eq(errors.CONFLICT, assert(err):kind())
            test.eq("mail_db_test_refused", err:details().code)

            local rows, read_err = db.with_db(function(ex)
                return ex:query("SELECT upload_id FROM mail_asset_file WHERE upload_id = $1", {upload_id})
            end)
            test.is_nil(read_err)
            test.eq(0, #assert(rows))
        end)
    end)
end)}
