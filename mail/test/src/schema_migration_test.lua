-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry = require("registry")
local sql = require("sql")
local test = require("test")

local tables = {
    "mail_message", "mail_library", "mail_asset_file", "mail_library_revision",
    "mail_library_asset", "mail_message_asset",
    "mail_library_reference", "mail_library_preview",
    "mail_library_history", "mail_library_upload_ref", "mail_library_live",
}

local indexes = {
    "mail_message_idempotency", "mail_message_sender_page", "mail_message_page",
    "mail_message_sender_status_page", "mail_message_status_page", "mail_message_check",
    "mail_message_expiry", "mail_message_template_page", "mail_message_failed_at",
    "mail_library_state", "mail_library_base", "mail_asset_file_due",
    "mail_library_revision_asset", "mail_library_asset_upload", "mail_message_asset_upload",
    "mail_library_reference_to", "mail_library_preview_expiry",
    "mail_library_history_page", "mail_library_upload_ref_reap",
}

local function inspect_schema(db_id: string)
    local db = assert(sql.get(db_id))
    local postgres = db:type() == sql.type.POSTGRES
    local rows, err
    if postgres then
        rows, err = db:query([[
            SELECT table_name AS name, 'table' AS kind FROM information_schema.tables
                WHERE table_schema = current_schema() AND table_type = 'BASE TABLE'
            UNION ALL
            SELECT indexname AS name, 'index' AS kind FROM pg_indexes WHERE schemaname = current_schema()
        ]])
    else
        rows, err = db:query("SELECT name, type AS kind FROM main.sqlite_master WHERE type IN ('table', 'index')")
    end
    db:release()

    local names: {[string]: string} = {}
    for _, row in ipairs(assert(rows, err)) do
        names[tostring(row.name)] = tostring(row.kind)
    end
    return names, postgres
end

return {run = test.run_cases(function()
    test.describe("Mail schema", function()
        test.it("installs one Mail schema migration for the configured database", function()
            local migrations = {}
            for _, entry in ipairs(assert(registry.find({[".meta.type"] = "migration"}))) do
                if entry.id:match("^kickside%.mail%.migrations:") then
                    migrations[#migrations + 1] = entry
                end
            end
            test.eq(#migrations, 1)
            test.eq(migrations[1].id, "kickside.mail.migrations:01_mail")
            local config = assert(registry.get("kickside.mail:db_config"))
            test.eq(config.meta.db_id, "app:db")
            test.eq(migrations[1].meta.target_db, config.meta.db_id)
        end)

        test.it("creates the Mail tables and indexes in the bound database", function()
            local config = assert(registry.get("kickside.mail:db_config"))
            local names, postgres = inspect_schema(config.meta.db_id)
            for _, name in ipairs(tables) do
                test.is_true(names[name] == "table", "missing table " .. name)
            end
            for _, name in ipairs(indexes) do
                test.is_true(names[name] == "index", "missing index " .. name)
            end
            if postgres then
                test.is_true(names.mail_library_page == "index", "missing index mail_library_page")
                test.is_true(names.mail_library_asset_page == "index", "missing index mail_library_asset_page")
            end
        end)

        test.it("advertises only current history actions", function()
            local history = assert(registry.get("kickside.mail.traits:library_history"))
            local actions = history.meta.output_schema.properties.items.items.properties.action.enum
            local expected = {"created", "edited", "base_changed", "reset", "restored", "archived"}
            test.eq(#actions, #expected)
            for index, action in ipairs(expected) do
                test.eq(actions[index], action)
            end
        end)
    end)
end)}
