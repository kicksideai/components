-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local channel = require("channel")
local events = require("events")
local json = require("json")
local process = require("process")
local registry = require("registry")
local time = require("time")
local uuid = require("uuid")
local jobs = require("jobs")
local lifecycle = require("lifecycle")
local limits = require("limits")
local types = require("types")
local manifests = require("manifests")
local migration_runner = require("migration_runner")
local plugin_rows = require("plugin_rows")
local store = require("store")
local values = require("values")

local function catalog(): (types.Catalog, types.Migrations)
    -- The commit event is delivered during the transition. The version read
    -- waits for the registry to publish its new snapshot.
    assert(registry.current_version())
    local state = assert(assert(registry.snapshot()):state())
    local versions: { [string]: string } = {}
    for _, module in ipairs(state.resolution and state.resolution.modules or {}) do
        versions[module.name] = module.version
    end
    local current: types.Catalog = {}
    local migrations: types.Migrations = {}
    for _, entry in ipairs(state.entries) do
        local owner = entry.registry.owner
        if entry.kind == "registry.entry" and entry.meta.type == manifests.TYPE then
            current[entry.id] = { meta = entry.meta, data = entry.data, owner = owner, version = versions[owner] }
        elseif owner ~= "" and entry.meta.type == "migration" and type(entry.meta.target_db) == "string" then
            local target = entry.meta.target_db :: string
            migrations[owner] = migrations[owner] or {}
            local group = migrations[owner]
            group[target] = group[target] or {}
            table.insert(group[target], entry.id)
        end
    end
    return current, migrations
end

local function reconcile(previous: types.Catalog): (types.Catalog, boolean)
    local current, migrations = catalog()
    local settings = assert(limits.read())
    local db_id = assert(store.db_id())
    local applied: { [string]: { [string]: boolean } } = {}
    local function ready(target: string, ids: { string }): boolean
        local known = applied[target]
        if not known then
            known = {}
            for _, row in ipairs(assert(migration_runner.setup(target):find_migrations())) do
                known[row.id] = row.applied == true
            end
            applied[target] = known
        end
        for _, id in ipairs(ids) do if not known[id] then return false end end
        return true
    end

    local pending = false
    for plugin, manifest in pairs(current) do
        if not values.equal(previous[plugin], manifest) then
            local migrated = ready(db_id, { "kickside.work.migrations:01_work" })
            for target, ids in pairs(migrations[manifest.owner] or {}) do
                migrated = migrated and ready(target, ids)
            end
            if migrated then
                local refresh = json.encode({ refresh = uuid.v4() })
                local after: string? = ""
                repeat
                    local cursor = after :: string
                    local page, err = lifecycle.transaction(function(tx, dialect)
                        return plugin_rows.refresh_page(tx, dialect, plugin, cursor, settings.plugin_discovery_batch, refresh)
                    end)
                    assert(page and not err, tostring(err))
                    if page.enrolled then
                        local _, wake_err = jobs.nudge_workers()
                        if wake_err then error(wake_err) end
                    end
                    after = page.next
                until after == nil
            else
                current[plugin] = previous[plugin]
                pending = true
            end
        end
    end
    return current, pending
end

local function run()
    assert(process.set_options({ upgradable = true }))
    local subscription = assert(events.subscribe("registry", "registry.commit"))
    local commits = subscription:channel()
    local signals = process.events()
    local previous: types.Catalog = {}
    while true do
        local pending
        previous, pending = reconcile(previous)
        local cases = { commits:case_receive(), signals:case_receive() }
        -- Keeper publishes the registry first and applies migrations afterwards.
        -- Only an update with unapplied migrations needs a timer.
        if pending then cases[#cases + 1] = time.after("1s"):case_receive() end
        local selected = channel.select(cases)
        if not selected.ok then error("Work plugin update channel closed") end
        if selected.channel == signals and selected.value.kind == process.event.CANCEL then
            subscription:close()
            return
        elseif selected.channel == signals and selected.value.kind == process.event.OUTDATED then
            subscription:close()
            return process.upgrade()
        end
    end
end

return { run = run }
