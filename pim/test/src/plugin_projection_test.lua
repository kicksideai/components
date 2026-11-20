-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local scoped = require("scoped")
local worker = require("worker")
local test = require("test")
local funcs = require("funcs")
local fixture = require("fixture")
local time = require("time")
local sql = require("sql")
local component = require("component")
local types = require("types")
local attachments = require("attachments")
local json = require("json")

type Map = { [string]: unknown }
local PLUGIN = "app:folding_plugin"
local KIND = "app:product_fold"

local function attachment(h: fixture.Handle): Map?
    local found, err = component.list_system({ impl_ids = { "app:plugin_attachment" }, meta = { owner = h.id }, include = { meta = true, private_context = true }, limit = 2 })
    assert(not err, tostring(err))
    assert(#(found or {}) <= 1, "one attachment per catalog")
    return found and found[1] :: Map?
end

local function view(h: fixture.Handle): Map
    local out, err = h.call("get_schema", {})
    assert(not err, tostring(err))
    for _, plugin in ipairs((out :: types.SchemaView).plugins) do if plugin.plugin == PLUGIN then return plugin :: Map end end
    error("installed plugin appears in the schema")
end

-- Lifecycle convergence may span several Jobs pages, followed by Component's
-- asynchronous deletion. This is a harness observation budget, not a promised
-- completion latency for either service.
local function wait_removed(h: fixture.Handle)
    for _ = 1, 600 do
        if not attachment(h) then return end
        local state = view(h).lifecycle
        assert(state.state ~= "failed", json.encode(state))
        time.sleep("50ms")
    end
    error("plugin attachment cleanup did not converge: " .. json.encode(view(h)))
end

local function wait_for(h: fixture.Handle, parked: boolean): Map
    local lifecycle
    for _ = 1, 300 do
        local plugin = view(h)
        lifecycle = plugin.lifecycle
        assert(lifecycle.state ~= "failed", json.encode(lifecycle))
        local state = plugin.projections[KIND]
        if lifecycle.state == "ready" and type(state) == "table" then
            local p = state :: Map
            if p.parked ~= true then
                -- Ask Core to dispatch this cursor and observe its committed result.
                local caught, err = h.call("settle", { kind = KIND, projection_key = "kickside.pim.plugin:" .. PLUGIN, max_ticks = 2 })
                if parked then
                    assert(err and err:kind() == errors.CONFLICT, tostring(err or "projection should park"))
                else
                    assert(caught and caught.done, tostring(err))
                end
                p = assert(view(h).projections[KIND]) :: Map
                if caught then test.is_true((p.last_seq :: integer) >= caught.event_count) end
            end
            test.eq(p.parked, parked, json.encode(p))
            return p
        end
        time.sleep("10ms")
    end
    error("plugin projection registration did not become ready: " .. json.encode(lifecycle))
end

local function rows(h: fixture.Handle): { Map }
    local db = assert(sql.get("app:db"))
    assert(db:execute("CREATE TABLE IF NOT EXISTS pim_test_plugin_fold (catalog_id TEXT NOT NULL, seq BIGINT NOT NULL, event_type TEXT NOT NULL, actor_id TEXT NOT NULL, marker TEXT NOT NULL, deliveries BIGINT NOT NULL, PRIMARY KEY (catalog_id, seq))", {}))
    local out, err = db:query("SELECT seq, event_type, actor_id, marker, deliveries FROM pim_test_plugin_fold WHERE catalog_id = $1 ORDER BY seq", { h.id })
    db:release()
    assert(not err, tostring(err))
    return out :: { Map }
end

local function activate(h: fixture.Handle, enabled: boolean, fail: boolean?)
    local request: Map = enabled and { declaration = { plugins = { { use = PLUGIN } } }, plugin_configs = { [PLUGIN] = { fail = fail == true } } }
        or { declaration = { remove = { plugins = { PLUGIN } } } }
    local _, err = h.call("apply_schema", request)
    assert(not err, tostring(err))
end

local function define()
    test.describe("declared plugin projections", function()
        for _,mode in ipairs({"feed","schema"}) do
        test.it("keeps "..mode.." plugin reads at the snapshot during a deterministic write",function()
            local h=fixture.catalog()
            fixture.boot(h)
            assert(h.call("apply_schema",{declaration={plugins={{use="app:state_plugin"}}},plugin_configs={["app:state_plugin"]={marker="before-snapshot"}}}))
            for _=1,300 do
                if assert(h.call("plugin_context",{plugin="app:state_plugin"})).lifecycle.state=="ready" then break end
                time.sleep("10ms")
            end
            local before=assert(h.call("get_schema",{})).as_of
            local out,err
            if mode=="feed" then
                out,err=h.executor:call("app:feed_head_probe",{catalog_id=h.id,plugin="app:state_plugin",kind="app:state_fold",head=before,interleave=true})
                test.is_nil(err,tostring(err))
                test.eq(out.config.marker,"before-snapshot")
                local child:Map?=nil
                for _,row in ipairs(out.changes) do if row.sku=="RDG-moss-40" then child=row end end
                test.not_nil(child)
                test.eq(child.values["core.gtin"][""],"0400moss40")
                test.is_true(child.updated_seq<=before)
            else
                out,err=h.executor:call("app:schema_snapshot_probe",{catalog_id=h.id})
                test.is_nil(err,tostring(err))
                test.eq(out.as_of,before)
                local plugin:Map?=nil
                for _,p in ipairs(out.plugins) do if p.plugin=="app:state_plugin" then plugin=p end end
                test.not_nil(plugin)
                test.eq(plugin.config.marker,"before-snapshot")
            end
            test.is_true(assert(h.call("get_schema",{})).as_of>before)
            test.eq(assert(h.call("get",{product={sku="RDG-moss-40"}})).values["core.gtin"].value,"after-snapshot")
        end)
        end
        test.it("keeps the state feed working after saving unchanged configuration",function()
            local h=fixture.catalog()
            assert(h.call("apply_schema",{declaration={plugins={{use="app:state_plugin"}}},plugin_configs={["app:state_plugin"]={marker="stable"}}}))
            for _=1,300 do
                if assert(h.call("plugin_context",{plugin="app:state_plugin"})).lifecycle.state=="ready" then break end
                time.sleep("10ms")
            end
            local before=assert(h.call("get_schema",{})).as_of
            assert(h.call("configure_plugin",{plugin="app:state_plugin",config={marker="stable"}}))
            test.eq(assert(h.call("get_schema",{})).as_of,before)
            assert(h.call("plugin_sync",{}))
            local page,err=h.call("plugin_feed",{plugin="app:state_plugin",kind="app:state_fold"})
            test.is_nil(err,tostring(err))
            test.not_nil(page)
        end)
        test.it("revalidates a stored worker binding before dispatch", function()
            local binding = assert(worker.parse("func://app:scoped_plugin_worker", true))
            local result, err = worker.validate(binding, false)
            test.is_nil(result)
            test.eq(err:kind(), errors.PERMISSION_DENIED)
        end)

        test.it("bootstraps every existing record on idle member activation and follows changes and deletes", function()
            local member = scoped.member()
            local h = scoped.catalog(member)
            assert(h.call("apply", { items = { { product = { sku = "STATE-1" }, create = { family = "footwear" } }, { product = { sku = "STATE-2" }, create = { family = "footwear" } } } }))
            local activated, err = h.call("apply_schema", { declaration = { plugins = { { use = "app:state_plugin" } } }, plugin_configs = { ["app:state_plugin"] = { marker = "state" } } })
            test.is_nil(err, tostring(err))
            for _ = 1, 300 do
                local current = h.call("plugin_context", { plugin = "app:state_plugin" }) :: Map
                if current.lifecycle.state == "ready" then break end
                time.sleep("10ms")
            end
            local function recorded(): Map?
                local db = assert(sql.get("app:db"))
                assert(db:execute("CREATE TABLE IF NOT EXISTS pim_test_plugin_state (catalog_id TEXT NOT NULL, product_id TEXT NOT NULL, body TEXT NOT NULL, PRIMARY KEY (catalog_id, product_id))", {}))
                local rows = assert(db:query("SELECT body FROM pim_test_plugin_state WHERE catalog_id=$1", { h.id }))
                db:release()
                if #rows ~= 2 then return nil end
                for _, row in ipairs(rows) do
                    local item = json.decode(row.body) :: Map
                    if item.change.sku == "STATE-1" then return item end
                end
                return nil
            end
            for _ = 1, 300 do if recorded() then break end; time.sleep("10ms") end
            local first = assert(recorded(), "state bootstrap delivers the existing product")
            test.is_true(first.bootstrap)
            test.eq(first.change.op, "upsert")
            test.eq(first.change.sku, "STATE-1")
            test.eq(first.config.marker, "state")
            test.eq(first.plugin, "app:state_plugin")
            test.not_nil(first.attachment_id)
            assert(h.call("apply", { items = { { product = { sku = "STATE-1" }, expect_version = "any", set = { { attr = "core.care", value = "changed" } } } } }))
            for _ = 1, 300 do if recorded().change.values["core.care"][""] == "changed" then break end; time.sleep("10ms") end
            test.eq(recorded().change.values["core.care"][""], "changed")
            assert(h.call("apply", { items = { { product = { sku = "STATE-1" }, expect_version = "any", delete = true } } }))
            for _ = 1, 300 do if recorded().change.op == "delete" then break end; time.sleep("10ms") end
            test.eq(recorded().change.op, "delete")
            local out, denied = funcs.new():with_actor(member.actor):with_scope(member.scope:with(assert(require("security").policy("app:caller_only")))):call("app:direct_call", { id="app:plugin_state_worker", input={} })
            test.is_nil(out)
            test.eq(denied:kind(), errors.PERMISSION_DENIED)
            assert(h.call("configure_plugin", { plugin="app:state_plugin", config={fail=true} }))
            local parked: Map? = nil
            for _ = 1, 300 do
                local context = assert(h.call("plugin_context", {plugin="app:state_plugin"}))
                parked = context.projections["app:state_fold"]
                if parked and parked.parked then break end
                time.sleep("10ms")
            end
            test.is_true(parked.parked)
            test.not_nil(parked.error)

        end)

        test.it("refuses a registration from another captured plugin configuration",function()
            local h=fixture.catalog()
            assert(h.call("apply_schema",{declaration={plugins={{use="app:state_plugin"}}},plugin_configs={["app:state_plugin"]={marker="captured"}}}))
            for _=1,300 do
                if assert(h.call("plugin_context",{plugin="app:state_plugin"})).lifecycle.state=="ready" then break end
                time.sleep("10ms")
            end
            local out,err=h.executor:call("app:feed_head_probe",{catalog_id=h.id,plugin="app:state_plugin",kind="app:state_fold",head=0,mismatch=true})
            test.is_nil(out)
            test.eq(err:kind(),errors.UNAVAILABLE)
            test.eq(err:details().code,"plugin_registration_pending")
            test.is_true(err:retryable())
        end)
        test.it("bounds feed pages, keeps bootstrap in its token and admits only active declared projections", function()
            local h=fixture.catalog()
            local items: { Map } = {}
            for i=1,201 do items[#items+1]={product={sku="PAGE-"..i},create={family="footwear"}} end
            assert(h.call("apply",{items=items}))
            local _,inactive=h.call("plugin_feed",{plugin="app:state_plugin",kind="app:state_fold"})
            test.eq(inactive:kind(),errors.NOT_FOUND)
            test.eq(inactive:details().code,"plugin_inactive")
            assert(h.call("apply_schema",{declaration={plugins={{use="app:state_plugin"}}},plugin_configs={["app:state_plugin"]={marker="page"}}}))
            for _=1,300 do
                if assert(h.call("plugin_context",{plugin="app:state_plugin"})).lifecycle.state=="ready" then break end
                time.sleep("10ms")
            end
            local first=assert(h.call("plugin_feed",{plugin="app:state_plugin",kind="app:state_fold"}))
            test.eq(#first.changes,200)
            test.is_true(first.bootstrap)
            test.is_false(first.done)
            test.eq(first.config.marker,"page")
            local second=assert(h.call("plugin_feed",{plugin="app:state_plugin",kind="app:state_fold",token=first.token}))
            test.eq(#second.changes,1)
            test.is_true(second.bootstrap)
            test.is_true(second.done)
            local host_position=assert(h.call("get_schema",{})).as_of
            local behind=assert((h.executor :: funcs.Executor):call("app:feed_head_probe",{catalog_id=h.id,plugin="app:state_plugin",kind="app:state_fold",token=first.token,head=host_position+1}))
            test.eq(#behind.changes,1)
            test.is_false(behind.done)
            local caught_up=assert((h.executor :: funcs.Executor):call("app:feed_head_probe",{catalog_id=h.id,plugin="app:state_plugin",kind="app:state_fold",token=first.token,head=host_position}))
            test.is_true(caught_up.done)

            local third=assert(h.call("plugin_feed",{plugin="app:state_plugin",kind="app:state_fold",token=second.token}))
            test.eq(#third.changes,0)
            test.is_false(third.bootstrap)
            test.is_true(third.done)
            local _,bad=h.call("plugin_feed",{plugin="app:state_plugin",kind="app:state_fold",token="malformed"})
            test.eq(bad:kind(),errors.INVALID)
            local _,undeclared=h.call("plugin_feed",{plugin="app:state_plugin",kind="app:other"})
            test.eq(undeclared:details().code,"plugin_projection_invalid")
            local reader=fixture.user(h)
            local _,denied=reader("plugin_feed",{plugin="app:state_plugin",kind="app:state_fold"})
            test.eq(denied:kind(),errors.PERMISSION_DENIED)
            local other=fixture.catalog()
            assert(other.call("apply_schema",{declaration={plugins={{use="app:state_plugin"}}},plugin_configs={["app:state_plugin"]={}}}))
            for _=1,300 do
                if assert(other.call("plugin_context",{plugin="app:state_plugin"})).lifecycle.state=="ready" then break end
                time.sleep("10ms")
            end
            local _,foreign=other.call("plugin_feed",{plugin="app:state_plugin",kind="app:state_fold",token=second.token})
            test.eq(foreign:kind(),errors.INVALID)
            assert(h.call("apply",{items={{product={sku="PAGE-1"},expect_version="any",set={{attr="core.care",value="after gap"}}}}}))
            local position=assert(h.call("get_schema",{})).as_of
            local db=assert(sql.get("app:db"))
            assert(db:execute("UPDATE kickside_pim_catalog SET tombstone_floor_seq=$1 WHERE catalog_id=$2",{position,h.id}))
            db:release()
            local reset=assert(h.call("plugin_feed",{plugin="app:state_plugin",kind="app:state_fold",token=second.token}))
            test.is_true(reset.bootstrap)
            test.eq(#reset.changes,200)
            test.is_false(reset.done)
        end)

        test.it("answers the same projection progress in schema options and plugin context", function()
            local h = fixture.catalog()
            activate(h, true)
            local progress = wait_for(h, false)
            local context = assert(h.call("plugin_context", { plugin = PLUGIN })) :: Map
            local options = assert(h.call("schema_options", {})) :: types.SchemaOptions
            local option: types.PluginOption? = nil
            for _, entry in ipairs(options.plugins) do if entry.plugin == PLUGIN then option = entry end end
            test.not_nil(option)
            test.is_true(option.active)
            test.not_nil(option.config_schema)
            local listed = option.projections["app:product_fold"]
            test.not_nil(listed)
            test.eq(listed.last_seq, progress.last_seq)
            test.eq(listed.last_seq, context.projections["app:product_fold"].last_seq)
            test.eq(listed.parked, context.projections["app:product_fold"].parked)
            test.eq(listed.bootstrapping, context.projections["app:product_fold"].bootstrapping)
        end)

        test.it("separates attachment identity by plugin and activation generation", function()
            local one = assert(attachments.id("catalog", "app:one", 1))
            test.eq(assert(attachments.id("catalog", "app:one", 1)), one)
            test.is_true(assert(attachments.id("catalog", "app:two", 1)) ~= one)
            test.is_true(assert(attachments.id("catalog", "app:one", 2)) ~= one)
        end)
        test.it("refuses lifecycle provisioning by a catalog reader", function()
            local h = fixture.catalog()
            local reader, id = fixture.user(h)
            local _, gerr = h.call("grant", { subject_id = id, mask = 1 })
            test.is_nil(gerr, tostring(gerr))
            local _, err = reader("plugin_sync", {})
            test.not_nil(err)
            test.eq((err :: error):kind(), errors.PERMISSION_DENIED)
        end)

        test.it("starts at activation, follows new facts, removes on deactivation and uses a new attachment on reactivation", function()
            local h = fixture.catalog()
            assert(h.call("apply", { items = { { product = { sku = "PLUGIN-1" }, create = { family = "footwear" } } } }))
            activate(h, true)
            wait_for(h, false)
            local attached = assert(attachment(h))
            test.eq((attached.private_context :: Map).catalog_id, h.id)
            test.eq(#rows(h), 0)
            assert(h.call("apply", { items = { { product = { sku = "PLUGIN-1" }, expect_version = "any", set = { { attr = "core.care", value = "Dry clean" } } } } }))
            wait_for(h, false)
            test.eq(#rows(h), 1)
            test.eq(rows(h)[1].event_type, "kickside.pim.events:product.changed")
            test.eq(rows(h)[1].actor_id, h.actor:id())
            activate(h, false)
            wait_removed(h)
            test.is_nil(attachment(h))
            local db=assert(sql.get("app:db"))
            local provenance=assert(db:query("SELECT component_id FROM kickside_pim_creation WHERE catalog_id=$1 AND component_id=$2",{h.id,attached.component_id}))
            assert(db:release())
            test.eq(#provenance,0,"intentional attachment removal releases its creation record")
            test.is_false(view(h).active)
            local historical = h.call("get_schema", { generation = 2 }) :: types.SchemaView
            local was_active = false
            for _, p in ipairs(historical.plugins) do if p.plugin == PLUGIN then was_active = p.active end end
            test.is_true(was_active)
            local listing = h.call("plugin_projections", {}) :: { projections: { Map } }
            for _, p in ipairs(listing.projections) do test.is_false(p.kind == "app:product_fold") end
            assert(h.call("apply", { items = { { product = { sku = "PLUGIN-2" }, create = { family = "footwear" } } } }))
            activate(h, true)
            wait_for(h, false)
            test.eq(#rows(h), 0)
            test.is_true(assert(attachment(h)).component_id ~= attached.component_id)
        end)

        test.it("removes plugin projections beyond the first discovery page", function()
            local h=fixture.catalog()
            assert(h.call("projection_padding",{}))
            activate(h,true)
            wait_for(h,false)
            activate(h,false)
            wait_removed(h)
            test.is_nil(attachment(h))
            local page=assert(h.call("plugin_projections",{}))
            for _,projection in ipairs(page.projections) do
                test.is_true(projection.projection_key~="kickside.pim.plugin:"..PLUGIN)
            end
        end)

        test.it("resets changed configuration at its fact without replaying prior events", function()
            local h = fixture.catalog()
            activate(h, true)
            wait_for(h, false)
            assert(h.call("apply", { items = { { product = { sku = "CONFIG-1" }, create = { family = "footwear" } } } }))
            wait_for(h, false)
            test.eq(rows(h)[1].marker, "initial")
            assert(h.call("configure_plugin", { plugin = PLUGIN, config = { fail = false, marker = "reconfigured" } }))
            wait_for(h, false)
            assert(h.call("apply", { items = { { product = { sku = "CONFIG-2" }, create = { family = "footwear" } } } }))
            wait_for(h, false)
            local recorded = rows(h)
            test.eq(#recorded, 2)
            test.eq(recorded[1].marker, "initial")
            test.eq(recorded[2].marker, "reconfigured")
            test.eq(tonumber(recorded[1].deliveries), 1)
        end)

        test.it("keeps the cursor and recordings on unrelated schema and repeated sync", function()
            local h = fixture.catalog()
            assert(h.call("apply", { items = { { product = { sku = "STABLE-1" }, create = { family = "footwear" } } } }))
            activate(h, true)
            local before = wait_for(h, false)
            local recorded = rows(h)
            assert(h.call("apply_schema", { declaration = { policy = { trash_days = 31 } } }))
            assert(h.call("plugin_sync", {}))
            local after = wait_for(h, false)
            test.is_true((after.last_seq :: integer) >= (before.last_seq :: integer))
            -- Core acknowledges the new schema event without delivering it to this worker.
            assert(h.call("apply_schema", { declaration = { policy = { trash_days = 31 } } }))
            assert(h.call("plugin_sync", {}))
            test.eq(wait_for(h, false).last_seq, after.last_seq)
            local after_rows = rows(h)
            test.eq(#after_rows, #recorded)
            for i, row in ipairs(after_rows) do
                for key, value in pairs(recorded[i]) do test.eq(row[key], value) end
            end
        end)

        test.it("parks a failing plugin cursor while catalog commands continue", function()
            local h = fixture.catalog()
            activate(h, true, true)
            local _, err = h.call("apply", { items = { { product = { sku = "FAIL-1" }, create = { family = "footwear" } } } })
            test.is_nil(err, tostring(err))
            local state = wait_for(h, true)
            test.not_nil(state.error)
            local out, next_err = h.call("apply", { items = { { product = { sku = "FAIL-2" }, create = { family = "footwear" } } } })
            test.is_nil(next_err, tostring(next_err))
            test.is_true((out :: types.ApplyResult).applied)
            test.is_true((view(h).projections["app:product_fold"] :: Map).parked == true)
        end)

        test.it("refuses missing and undeclared workers with condition codes before changing schema", function()
            local h = fixture.catalog()
            for id, code in pairs({ ["app:missing_worker_plugin"] = "plugin_projection_invalid", ["app:wrong_worker_plugin"] = "plugin_projection_invalid" }) do
                local _, err = h.call("apply_schema", { declaration = { plugins = { { use = id } } } })
                test.not_nil(err)
                test.eq((err :: error):kind(), errors.INVALID)
                test.eq((err :: error):details().code, code)
            end
            local out = h.call("get_schema", {}) :: types.SchemaView
            test.eq(out.schema_generation, 1)
        end)
    end)
end
return { run = test.run_cases(define) }
