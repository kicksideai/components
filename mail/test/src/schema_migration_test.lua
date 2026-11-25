-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local registry = require("registry")
local sql = require("sql")
local test = require("test")

local tables = {
    "mail_message", "mail_automation_receipt", "mail_library", "mail_asset_file",
    "mail_library_asset", "mail_message_asset",
    "mail_library_reference", "mail_library_preview",
    "mail_library_history", "mail_library_upload_ref", "mail_library_live",
}

local access_paths = {
    mail_message = {"idempotency_scope,idempotency_key", "sender,created_at desc,id desc", "created_at desc,id desc",
        "sender,status,created_at desc,id desc", "status,created_at desc,id desc", "next_check_at,id",
        "finished_at,id", "template,created_at desc,id desc", "finished_at,sender"},
    mail_library = {"state,kind,name", "base,name"},
    mail_asset_file = {"due_at,upload_id", "restore_check_at,upload_id"},
    mail_library_asset = {"upload_id"},
    mail_message_asset = {"upload_id"},
    mail_automation_receipt = {"message_id"},
    mail_library_reference = {"to_kind,to_name,from_kind,from_name"},
    mail_library_preview = {"expires_at,id"},
    mail_library_history = {"kind,name,seq desc", "kind,name,version"},
    mail_library_upload_ref = {"live,last_seq"},
}

local function inspect_schema(db_id: string)
    local db = assert(sql.get(db_id))
    local postgres = db:type() == sql.type.POSTGRES
    local rows, err
    if postgres then
        rows, err = db:query([[
            SELECT table_name AS name, NULL AS definition FROM information_schema.tables
                WHERE table_schema = current_schema() AND table_type = 'BASE TABLE'
            UNION ALL
            SELECT tablename AS name, indexdef AS definition FROM pg_indexes WHERE schemaname = current_schema()
        ]])
    else
        rows, err = db:query([[
            SELECT name, NULL AS definition FROM main.sqlite_master WHERE type = 'table'
            UNION ALL
            SELECT tbl_name AS name, sql AS definition FROM main.sqlite_master WHERE type = 'index' AND sql IS NOT NULL
        ]])
    end
    db:release()

    local names, indexes = {}, {}
    for _, row in ipairs(assert(rows, err)) do
        if type(row.definition) == "string" then
            local columns = row.definition:match("%(([^()]+)%)")
            if columns then indexes[row.name .. ":" .. columns:lower():gsub(",%s*", ",")] = true end
        else
            names[row.name] = true
        end
    end
    return names, indexes, postgres
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
            local names, indexes, postgres = inspect_schema(config.meta.db_id)
            for _, name in ipairs(tables) do
                test.is_true(names[name], "missing table " .. name)
            end
            for name, paths in pairs(access_paths) do
                for _, columns in ipairs(paths) do
                    test.is_true(indexes[name .. ":" .. columns], "missing access path " .. name .. "(" .. columns .. ")")
                end
            end
            if postgres then
                test.is_true(indexes['mail_library:kind collate "c",name collate "c"'])
                test.is_true(indexes['mail_library_asset:name collate "c"'])
            end
        end)

        test.it("installs History without a revision snapshot table", function()
            local config = assert(registry.get("kickside.mail:db_config"))
            local names = inspect_schema(config.meta.db_id)
            test.is_nil(names.mail_library_revision)
            test.is_nil(names.mail_library_revision_asset)
        end)

        test.it("advertises only current history actions", function()
            local history = assert(registry.get("kickside.mail.traits:library_history"))
            local actions = history.meta.output_schema.properties.items.items.properties.action.enum
            local expected = {"created", "edited", "base_changed", "reset", "restored", "archived", "deleted"}
            test.eq(#actions, #expected)
            for index, action in ipairs(expected) do
                test.eq(actions[index], action)
            end
        end)
    end)
end)}
