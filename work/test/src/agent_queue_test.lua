-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local scoped = require("scoped")
local steps = require("steps")
local funcs = require("funcs")
local json = require("json")
local security = require("security")
local time = require("time")

local function expiry(duration: string): string
    return time.now():add(assert(time.parse_duration(duration))):utc():format("2006-01-02T15:04:05.000000000Z")
end

local function define()
    test.describe("Agent Queue pack", function()
        test.it("admits exactly one claimant, releases a crashed claim and fences the old winner", function()
            local admin = scoped.admin()
            local created, err = admin.call("create", { title = "Agent Queue", idempotency_key = "queue",
                pack = "kickside.work.packs:agent_queue", declaration = { key_prefix = fixture.fresh_prefix() } })
            assert(created, steps.detail(err))
            local board = created.board_id
            local function call(op, args) return admin.call(op, args, board) end
            local item = assert(call("apply", { ops = { { op = "create", type = "task", values = { title = "Run job" } } } })).outcomes[1]
            test.eq(item.status, "applied")
            local workers = { scoped.member(), scoped.member() }
            local writers = {}
            for i, worker in ipairs(workers) do
                assert(call("grant", { subject_id = worker.id, mask = 3 }))
                writers[i] = funcs.new():with_actor(worker.actor):with_scope(worker.scope:with(assert(security.policy("app:caller_only"))))
            end
            local commands = {}
            local expires_at = expiry("3s")
            for i, writer in ipairs(writers) do
                commands[i] = assert(writer:async("app:work_call", { op = "apply", board_id = board, request = {
                    key = "claim-" .. i, ops = { { op = "transition", item = item.item, transition = "claim",
                        expect_version = item.version, values = { claimant = { kind = "user", id = workers[i].id },
                            claim_expires_at = expires_at } } },
                } }))
            end
            local winner, loser, claimed_version
            local applied, conflicts = 0, 0
            for i, command in ipairs(commands) do
                assert(command:response():receive())
                local result = assert(command:result()):data().outcomes[1]
                if result.status == "applied" then
                    winner, claimed_version = i, result.version
                    applied = applied + 1
                elseif result.status == "conflict" then
                    test.eq(result.findings[1].code, "version_mismatch")
                    loser = i
                    conflicts = conflicts + 1
                end
            end
            test.eq(applied, 1); test.eq(conflicts, 1)
            local function read() return assert(call("get", { item = { id = item.item } })).item end
            local claimed = read()
            test.eq(claimed.state, "claimed")
            test.eq(claimed.values.claimant.id, workers[winner].id)

            steps.wait_for("crashed claim to expire", function() return read().state == "queued" end)
            local released = read()
            test.is_nil(released.values.claimant); test.is_nil(released.values.claim_expires_at)
            local reclaimed = assert(workers[loser].call("apply", { key = "reclaim", ops = {
                { op = "transition", item = item.item, expect_version = released.version, transition = "claim",
                    values = { claimant = { kind = "user", id = workers[loser].id }, claim_expires_at = expiry("3s") } },
            } }, board)).outcomes[1]
            test.eq(reclaimed.status, "applied")
            local stale = assert(workers[winner].call("apply", { key = "stale-complete", ops = {
                { op = "transition", item = item.item, expect_version = claimed_version, transition = "complete" },
            } }, board)).outcomes[1]
            test.eq(stale.status, "conflict")
            test.eq(stale.findings[1].code, "version_mismatch")
            test.eq(read().values.claimant.id, workers[loser].id)

            local extended_expiry = expiry("6s")
            local renewed = assert(workers[loser].call("apply", { key = "renew", ops = {
                { op = "transition", item = item.item, expect_version = reclaimed.version, transition = "renew",
                    values = { claim_expires_at = extended_expiry } },
            } }, board)).outcomes[1]
            test.eq(renewed.status, "applied")
            local renewed_visit = read().visit
            steps.wait_for("renewed claim to expire", function() return read().state == "queued" end)
            local expirations = {}
            for _, event in ipairs(assert(call("events", {})).events) do
                if event.type == "kickside.work.events:timer.fired" then
                    local body = event.body
                    expirations[#expirations + 1] = type(body) == "string" and assert(json.decode(body)) or body
                end
            end
            test.eq(#expirations, 2)
            test.eq(expirations[2].visit, renewed_visit)
            test.eq(expirations[2].scheduled_at, extended_expiry)
        end)
    end)
end
return { run = test.run_cases(define) }
