-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local test = require("test")
local fixture = require("fixture")
local scoped = require("scoped")
local steps = require("steps")
local time = require("time")

local function expiry(duration: string): string
    return time.now():add(assert(time.parse_duration(duration))):utc():format("2006-01-02T15:04:05.000000000Z")
end

local function queue(admin: scoped.Session): fixture.Handle
    return scoped.board(admin, { key_prefix = fixture.fresh_prefix() }, "kickside.work.packs:agent_queue")
end

local function define()
    test.describe("Agent Queue pack", function()
        test.it("owns the lease fields through claim and renew", function()
            local admin = scoped.admin()
            local h = queue(admin)
            local claimant = { kind = "user", id = admin.id }
            local item = steps.create(h, "task", { title = "Run job" })
            local past = "2000-01-01T00:00:00Z"
            local missed = steps.one(h, { op = "transition", item = item, transition = "claim",
                values = { claimant = claimant, claim_expires_at = past } })
            test.eq(missed.findings and missed.findings[1].code, "timer_deadline_not_future")
            local initial = expiry("5m")
            test.eq(steps.one(h, { op = "transition", item = item, transition = "claim",
                values = { claimant = claimant, claim_expires_at = initial } }).status, "applied")
            local claimed = assert(steps.get(h, item)).item
            for _, op in ipairs({
                { op = "set", item = item, values = { claim_expires_at = expiry("1m") } },
                { op = "set", item = item, values = { claimant = { kind = "user", id = scoped.member().id } } },
                { op = "set", item = item, clear = { "claim_expires_at" } },
            }) do
                local refused = steps.one(h, op)
                test.eq(refused.findings[1].code, "transition_field_required")
            end
            test.eq(steps.one(h, { op = "set", item = item, values = { title = "Changed" } }).status, "applied")
            local missed_renewal = steps.one(h, { op = "transition", item = item, transition = "renew",
                values = { claim_expires_at = past } })
            test.eq(missed_renewal.findings[1].code, "timer_deadline_not_future")
            local extended = expiry("10m")
            test.eq(steps.one(h, { op = "transition", item = item, transition = "renew",
                values = { claim_expires_at = extended } }).status, "applied")
            local stale = steps.one(h, { op = "timer", item = item, state = "claimed", timer = "claim_expiry",
                visit = claimed.visit, scheduled_at = initial })
            test.eq(stale.status, "unchanged")
            local renewed = assert(steps.get(h, item)).item
            test.is_true(renewed.visit > claimed.visit)
            test.eq(renewed.values.claim_expires_at, extended)
            test.eq(renewed.values.claimant.id, admin.id)
            local early = steps.one(h, { op = "timer", item = item, state = "claimed", timer = "claim_expiry",
                visit = renewed.visit, scheduled_at = extended })
            test.eq(early.findings[1].code, "timer_not_due")
        end)

        test.it("admits one concurrent claimant and fences the previous winner after reclaim", function()
            local h = queue(scoped.admin())
            local item = steps.create(h, "task", { title = "Run job" })
            local version = steps.version(h, item)
            local workers = { scoped.member(), scoped.member() }
            for _, worker in ipairs(workers) do
                assert(h.call("grant", { subject_id = worker.id, mask = 3 }))
            end
            local commands = {}
            local expires_at = expiry("5m")
            for i, worker in ipairs(workers) do
                commands[i] = assert(worker.async_call("apply", { key = "claim-" .. i, ops = {
                    { op = "transition", item = item, transition = "claim", expect_version = version,
                        values = { claimant = { kind = "user", id = worker.id }, claim_expires_at = expires_at } },
                } }, h.id))
            end
            local winner, loser
            for i, command in ipairs(commands) do
                assert(command:response():receive())
                local outcome = assert(command:result()):data().outcomes[1]
                if outcome.status == "applied" then
                    winner = workers[i]
                else
                    test.eq(outcome.status, "conflict")
                    test.eq(outcome.findings[1].code, "version_mismatch")
                    loser = workers[i]
                end
            end
            assert(winner and loser, "expected one applied claim and one conflict")
            local claimed = assert(steps.get(h, item)).item
            test.eq(claimed.state, "claimed")
            test.eq(claimed.values.claimant.id, winner.id)

            local released = steps.one(h, { op = "transition", item = item, transition = "release",
                expect_version = claimed.version })
            test.eq(released.status, "applied")
            local reclaimed = assert(loser.call("apply", { key = "reclaim", ops = {
                { op = "transition", item = item, expect_version = released.version, transition = "claim",
                    values = { claimant = { kind = "user", id = loser.id }, claim_expires_at = expires_at } },
            } }, h.id)).outcomes[1]
            test.eq(reclaimed.status, "applied")
            local stale = assert(winner.call("apply", { key = "stale-complete", ops = {
                { op = "transition", item = item, expect_version = claimed.version, transition = "complete" },
            } }, h.id)).outcomes[1]
            test.eq(stale.status, "conflict")
            test.eq(stale.findings[1].code, "version_mismatch")
            test.eq(assert(steps.get(h, item)).item.values.claimant.id, loser.id)
        end)

        test.it("releases a crashed claim when the scheduler fires", function()
            local admin = scoped.admin()
            local h = queue(admin)
            local item = steps.create(h, "task", { title = "Run job" })
            local expires_at = expiry("3s")
            test.eq(steps.one(h, { op = "transition", item = item, transition = "claim",
                values = { claimant = { kind = "user", id = admin.id }, claim_expires_at = expires_at } }).status, "applied")
            local function read() return assert(steps.get(h, item)).item end
            local visit = read().visit
            steps.wait_for("crashed claim to expire", function() return read().state == "queued" end)
            local released = read()
            test.is_nil(released.values.claimant)
            test.is_nil(released.values.claim_expires_at)
            local expirations = {}
            for _, event in ipairs(steps.events(h)) do
                if event.type == "kickside.work.events:timer.fired" then
                    expirations[#expirations + 1] = event.body
                end
            end
            test.eq(#expirations, 1)
            test.eq(expirations[1].visit, visit)
            test.eq(expirations[1].scheduled_at, expires_at)
        end)
    end)
end
return { run = test.run_cases(define) }
