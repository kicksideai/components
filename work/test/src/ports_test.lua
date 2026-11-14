-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local registry = require("registry")
local json = require("json")
local fixture = require("fixture")
local steps = require("steps")
local baseline = require("event_baseline")
local compatibility = require("event_compatibility")

type Map = { [string]: unknown }
local function define()
    test.describe("Work output ports", function()
        test.it("publishes a board picker port and schema for every board output", function()
            local binding = assert(registry.get("kickside.work.binding:board"))
            for _, output in ipairs(binding.meta.events.output) do
                local name = output.type:match(":(.+)$"):gsub("%.", "_")
                local port = assert(registry.get("kickside.work.ports:" .. name))
                test.eq(port.data.event, output.type)
                test.eq(port.data.binding, "kickside.work.binding:board")
                local picker = port.data.config_schema.thread_id
                test.eq(picker.class, "work_board")
                test.eq(picker.role, "primary")
                test.is_true(picker.required)
                test.is_nil(port.data.config_schema.states)
                test.is_nil(port.data.config_schema.item_types)
                test.eq(assert(registry.get(output.type)).data.schema.type, "object")
            end
        end)
        test.it("lists integration and tool discovery entries in their independent exact-id capabilities", function()
            local policy = assert(registry.get("kickside.work.security:module_access"))
            local listed: { [string]: boolean } = {}
            for _, id in ipairs(policy.data.policy.resources) do listed[id] = true end
            local tools: { [string]: boolean } = {}
            for _, id in ipairs(assert(registry.get("kickside.work.security:work_tools")).data.policy.resources) do tools[id] = true end
            local binding = assert(registry.get("kickside.work.binding:board"))
            for _, output in ipairs(binding.meta.events.output) do
                test.is_true(listed[output.type] == true, output.type)
                local name = output.type:match(":(.+)$"):gsub("%.", "_")
                test.is_true(listed["kickside.work.ports:" .. name] == true, name)
            end
            local surfaces = {
                source = { "items", "changes", "items_port", "changes_port", "pull_items", "pull_changes" },
                sink = { "items", "items_port", "write" },
                blocks = { "find", "get", "apply", "transition", "comment" },
                traits = { "work", "work_readonly", "work_admin", "build_work", "build_readonly", "find_items", "get_item", "apply", "transition", "comment", "get_schema", "explain" },
            }
            for namespace, names in pairs(surfaces) do
                for _, name in ipairs(names) do
                    local id = "kickside.work." .. namespace .. ":" .. name
                    test.not_nil(registry.get(id), id)
                    if namespace == "traits" then
                        test.is_nil(listed[id], id)
                        test.is_true(tools[id] == true, id)
                    else test.is_true(listed[id] == true, id) end
                end
            end
        end)
        test.it("keeps frozen output schemas compatible at every nested level", function()
            for id, schema in pairs(baseline.schemas) do
                local ok, err = compatibility.check(schema, assert(registry.get(id)).data.schema, id)
                test.is_nil(err, tostring(err))
                test.is_true(ok, id)
            end
            local frozen = baseline.schemas["kickside.work.events:item.changed"]
            local changed = assert(json.decode(assert(json.encode(frozen))))
            changed.properties.item.type = "integer"
            local ok, err = compatibility.check(frozen, changed, "item.changed")
            test.is_false(ok)
            test.eq(err:details().code, "event_schema_incompatible")
        end)
        test.it("emits schema-valid command, schema, item, relation, comment and lifecycle bodies", function()
            local h = fixture.board({ declaration = fixture.workflow(fixture.fresh_prefix()) })
            local a = steps.create(h, "story", { title = "A", assignee = { kind = "user", id = h.actor:id() } })
            local b = steps.create(h, "story", { title = "B" })
            steps.one(h, { op = "set", item = a, values = { title = "Changed" } })
            steps.one(h, { op = "transition", item = a, transition = "start" })
            steps.one(h, { op = "parent", item = a, parent = steps.create(h, "epic", { title = "Parent" }) })
            steps.one(h, { op = "link", item = a, type = "relates", target = { item = b } })
            steps.one(h, { op = "unlink", item = a, type = "relates", target = { item = b } })
            local comment = steps.one(h, { op = "comment", item = a, body = "Comment" }).comment
            steps.one(h, { op = "comment", item = a, comment = comment, body = "Edited" })
            steps.one(h, { op = "comment", item = a, comment = comment, delete = true })
            steps.one(h, { op = "delete", item = a })
            steps.one(h, { op = "restore", item = a })
            local seen: { [string]: boolean } = {}
            local failures: { string } = {}
            for _, e in ipairs(steps.events(h)) do
                local id = e.type :: string
                local entry = assert(registry.get(id))
                local ok, err = json.validate(entry.data.schema, e.body)
                if ok ~= true then failures[#failures + 1] = id .. ": " .. tostring(err) .. " " .. json.encode(e.body) end
                seen[id] = true
            end
            test.eq(#failures, 0, table.concat(failures, "\n"))
            for _, name in ipairs({ "schema.applied", "item.created", "item.changed", "item.transitioned", "item.parented", "item.linked", "item.unlinked", "comment.added", "comment.edited", "comment.deleted", "item.deleted", "item.restored" }) do
                test.is_true(seen["kickside.work.events:" .. name] == true, name)
            end
        end)
    end)
end
return { run = test.run_cases(define) }
