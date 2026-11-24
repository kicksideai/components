-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local changes = require("changes")
local clock = require("clock")
local consts = require("consts")
local document = require("document")
local guard = require("guard")
local layout = require("layout")
local limits = require("limits")
local sql = require("sql")
local store = require("store")
local domain = require("domain")
local types = require("types")

local M = {}
local REVIEW_ROWS = 10000

-- Restrict the candidate window before loading documents. Type ranges use the
-- generated (type, state, item_id) index. Board ranges use the fixed primary key.
local function page(db: sql.DB, board_id: string, item_type: string?, state: string, after: string, size: integer): ({ domain.Row }?, error?)
    if not item_type then
        return db:query("SELECT item_id FROM kickside_work_item WHERE board_id = $1 AND item_id > $2 ORDER BY item_id LIMIT $3",
            { board_id, after, size })
    end
    return db:query("SELECT state, item_id FROM " .. layout.names(board_id).item
        .. " WHERE type = $1 AND (state, item_id) > ($2, $3) ORDER BY state, item_id LIMIT $4", { item_type, state, after, size })
end

type Scan = { checked: integer, steps: integer, drops: { [string]: types.FieldDrop }, used: { [string]: boolean } }

local function scan(db: sql.DB, board_id: string, targets: { domain.FieldRemoval }, choices: { [string]: string },
    found: Scan, deadline: domain.Deadline, size: integer): error?
    local state, after = "", ""
    local item_type = targets[1].item_type
    while true do
        if clock.passed(deadline) then
            return errors.new({ kind = errors.TIMEOUT, message = "schema review deadline passed", details = { code = "schema_validation_deadline" } })
        end
        local limit = math.min(size, REVIEW_ROWS - found.checked + 1)
        local rows, err = page(db, board_id, item_type, state, after, limit)
        if err or not rows then return err end
        if #rows == 0 then return nil end
        found.checked = found.checked + #rows
        if found.checked > REVIEW_ROWS then
            return guard.invalid("field removal review exceeds its item budget", { code = "schema_removal_budget" })
        end
        local ids: { string } = {}
        for i, row in ipairs(rows) do
            local id, id_err = store.need(row, "item_id")
            if id_err or not id then return id_err end
            ids[i] = id
        end
        after = ids[#ids]
        if item_type then
            local key, key_err = store.need(rows[#rows], "state")
            if key_err or not key then return key_err end
            state = key
        end
        local items, item_err = store.items(db, board_id, ids)
        if item_err or not items then return item_err end
        for _, item in ipairs(items) do
            if item.life ~= "purged" then
                for _, target in ipairs(targets) do
                    local id = target.field.id
                    if document.value(item.document, id) ~= nil then found.used[target.path] = true end
                    if choices[target.path] == "drop" then
                        local step = document.remove_step(item.document, id, "unset")
                        if step then
                            found.steps = found.steps + 1
                            if found.steps > consts.LIMITS.ops then
                                return guard.invalid("drop exceeds the atomic patch limit; unset the values in batches before removing the field",
                                    { code = "schema_drop_budget", limit = consts.LIMITS.ops })
                            end
                            local drop = found.drops[item.item_id]
                            if not drop then
                                drop = { item = item.item_id, patch = {} }
                                found.drops[item.item_id] = drop
                            end
                            drop.patch[#drop.patch + 1] = step
                        end
                    end
                end
            end
        end
        local complete = true
        for _, target in ipairs(targets) do
            if choices[target.path] == "drop" or not found.used[target.path] then complete = false; break end
        end
        if complete or #rows < limit then return nil end
    end
end

function M.review(db: sql.DB, board: domain.Board, proposed: domain.Model, usage: domain.Usage,
    resolutions: { [string]: string }?, expected_generation: integer?): ({ domain.SchemaChange }?, { types.FieldDrop }?, boolean, error?)
    local choices = resolutions or {}
    local targets = changes.field_removals(board.model, proposed)
    local by_path: { [string]: domain.FieldRemoval } = {}
    for _, target in ipairs(targets) do by_path[target.path] = target end
    local keep = false
    for path, choice in pairs(choices) do
        if not by_path[path] or (choice ~= "keep" and choice ~= "archive" and choice ~= "drop") then
            return nil, nil, false, guard.invalid("resolution must name a field removal in this draft", { code = "invalid_field_resolution", path = path })
        end
        if choice == "keep" then keep = true end
    end
    if next(choices) and expected_generation == nil then
        return nil, nil, false, guard.invalid("field removal resolutions need the reviewed generation", { code = "field_resolution_generation_required" })
    end
    if keep then return {}, {}, true, nil end

    local found: Scan = { checked = 0, steps = 0, drops = {}, used = {} }
    local groups: { [string]: { domain.FieldRemoval } } = {}
    for _, target in ipairs(targets) do
        if (usage.fields[target.field.id] or 0) > 0 then
            if not target.item_type then found.used[target.path] = true end
            if target.item_type or choices[target.path] == "drop" then
                local key = target.item_type or ""
                if not groups[key] then groups[key] = {} end
                local group = groups[key]
                group[#group + 1] = target
            end
        end
    end
    if next(groups) then
        local settings, err = limits.read()
        if err or not settings then return nil, nil, false, err end
        local deadline = clock.deadline(settings.command_deadline_ms)
        for _, group in pairs(groups) do
            local scan_err = scan(db, board.board_id, group, choices, found, deadline, settings.rebuild_batch)
            if scan_err then return nil, nil, false, scan_err end
        end
    end
    local findings: { domain.SchemaChange } = {}
    for _, target in ipairs(targets) do
        if found.used[target.path] then
            local choice = choices[target.path]
            findings[#findings + 1] = { code = target.field.code, what = "field.remove", class = choice and "semantic" or "refused",
                path = target.path, item_type = target.item_type, resolution = choice or "keep",
                detail = target.item_type and "stored values on " .. target.item_type or "stored values across the board" }
        end
    end
    local drops: { types.FieldDrop } = {}
    for _, drop in pairs(found.drops) do
        table.sort(drop.patch, function(a, b) return a.f < b.f end)
        drops[#drops + 1] = drop
    end
    table.sort(drops, function(a, b) return a.item < b.item end)
    return findings, drops, false, nil
end

return M
