-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
-- The command pipeline over a fake thread client: appends stamp actor and time,
-- idempotent commands replay their receipt and refuse a reused key, a lost
-- expect race rebuilds, the deadline answers busy, and success waits for the
-- projection so the caller reads its own write.
local test = require("test")
local pipeline = require("pipeline")
local types = require("types")

type Map = { [string]: unknown }

type Fake = {
    last_seq: integer, done: boolean, appended: { { events: { types.Event }, expect: unknown } }, conflicts: { string },
    markers: { [string]: { seq: integer, body: unknown } }, marker_lookups: integer,
    catch_up_projection: (Fake, { [string]: unknown }) -> (unknown, error?),
    receipt: (string) -> (unknown, integer?, error?),
    append_events: (Fake, { [string]: unknown }) -> (unknown, error?),
    create: (Fake, { [string]: unknown }) -> (unknown, error?),
    ensure_thread: (Fake, { [string]: unknown }) -> (unknown, error?),
}

local function fake(): Fake
    local f: Fake = { last_seq = 10, done = true, appended = {}, conflicts = {}, markers = {}, marker_lookups = 0 } :: Fake
    f.catch_up_projection = function(self: Fake, _r: { [string]: unknown }): (unknown, error?)
        return { done = self.done, last_seq = self.done and self.last_seq or nil }, nil
    end
    f.receipt = function(marker: string): (unknown, integer?, error?)
        f.marker_lookups = f.marker_lookups + 1
        local stored = f.markers[marker]
        if not stored then return nil,nil,nil end
        return ((stored.body or {}) :: Map).receipt or {},stored.seq,nil
    end
    f.append_events = function(self: Fake, r: { [string]: unknown }): (unknown, error?)
        local reason = table.remove(self.conflicts, 1)
        if reason then return nil, errors.new({ kind = errors.CONFLICT, message = reason, details = { reason = reason } }) end
        local events = r.events :: { types.Event }
        self.appended[#self.appended + 1] = { events = events, expect = r.expect }
        self.last_seq = self.last_seq + #events
        return { max_seq = self.last_seq }, nil
    end
    f.create = function(_self: Fake, _r: { [string]: unknown }): (unknown, error?) return {}, nil end
    f.ensure_thread = function(_self: Fake, _r: { [string]: unknown }): (unknown, error?) return {}, nil end
    return f
end

local THREAD: pipeline.Thread = { id = "t1", kind = "app:model", source = "app" }

local function command(f: Fake, build: pipeline.Build, over: { [string]: unknown }?): pipeline.Command
    local c: { [string]: unknown } = { client = f, thread = THREAD, actor = "u1", deadline_ms = 300, fingerprint = { op = "x" }, receipt = f.receipt, build = build }
    for k, v in pairs(over or {}) do c[k] = v end
    return c :: pipeline.Command
end

local function event(name: string, body: unknown, subject: string?): types.Event
    return { type = name, subject = subject, body = body :: types.EventBody }
end

local function one_event(last_seq: integer): (pipeline.Attempt?, error?)
    return { result = { outcome = "done" }, events = { event("app:a", { n = 1 }, "s") },
        expect = { head = last_seq }, as_of = last_seq, catalog_seq = last_seq }, nil
end

local function define()
    test.describe("command pipeline", function()
        test.it("carries the earlier enclosing deadline to every projection wait", function()
            local f = fake()
            local ceiling = { at = "2090-01-01T00:00:00Z", ns = 3786912000000000000 }
            f.catch_up_projection = function(self: Fake, request: Map): (unknown, error?)
                test.eq(request.deadline, ceiling.at)
                return { done = true, last_seq = self.last_seq }, nil
            end
            local out, err = pipeline.run(command(f, one_event, { deadline_ms = 3000000000000, deadline = ceiling }))
            test.is_nil(err, tostring(err))
            test.not_nil(out)
        end)

        test.it("appends under the attempt's guard, stamps events and waits for the projection", function()
            local f = fake()
            local out, err = pipeline.run(command(f, one_event))
            test.is_nil(err)
            local r = out :: { [string]: unknown }
            test.eq(r.outcome, "done")
            test.eq(r.seq, 11)
            test.eq(r.as_of, 11)
            test.is_nil(r.replayed)
            local sent = f.appended[1]
            test.eq((sent.expect :: { [string]: unknown }).head, 10)
            local body = sent.events[1].body :: { [string]: unknown }
            test.eq(body.actor, "u1")
            test.not_nil(body.at)
            test.is_nil(sent.events[1].external)
        end)

        local function append_with_later_head(): (Fake, pipeline.Command)
            local f = fake()
            local build = function(head: integer): (pipeline.Attempt?, error?)
                return { result = { outcome = "done" }, events = { event("app:a", {}), event("app:b", {}) },
                    expect = { head = head }, as_of = head, catalog_seq = head }, nil
            end
            return f, command(f, build, { idempotency = { namespace = "n", key = "k" } })
        end

        local function hold_later_append(f: Fake)
            local head = f.last_seq + 1
            f.catch_up_projection = function(self: Fake, request: Map): (unknown, error?)
                local target = (request.target_seq or head) :: integer
                local done = target <= self.last_seq
                return { done = done, last_seq = self.last_seq }, nil
            end
        end

        test.it("acknowledges the append while a later event is still pending", function()
            local f, c = append_with_later_head()
            c.idempotency = nil
            local append = f.append_events
            f.append_events = function(self: Fake, request: Map): (unknown, error?)
                local out, err = append(self, request)
                hold_later_append(self)
                return out, err
            end
            local out, err = pipeline.run(c)
            assert(out, tostring(err))
            test.eq(out.seq, 12)
            test.eq(out.as_of, 12)
        end)

        test.it("waits through the last receipt event while a later event is still pending", function()
            local f, c = append_with_later_head()
            assert(pipeline.run(c))
            local first = f.appended[1].events[1]
            f.markers[assert(first.external).external_id] = { seq = 11, body = first.body }
            hold_later_append(f)
            local target: unknown = nil
            local catch_up = f.catch_up_projection
            f.catch_up_projection = function(self: Fake, request: Map): (unknown, error?)
                target = request.target_seq
                return catch_up(self, request)
            end
            local out, err = pipeline.run(c)
            assert(out, tostring(err))
            test.eq(target, 12)
            test.eq(out.seq, 12)
            test.eq(out.as_of, 12)
            test.is_true(out.replayed == true)
            test.eq(#f.appended, 1)
        end)

        test.it("checks sourced replay only after covering the sampled head", function()
            local f, c = append_with_later_head()
            c.receipt_requires_head = true
            assert(pipeline.run(c))
            local first = f.appended[1].events[1]
            f.markers[assert(first.external).external_id] = { seq = 11, body = first.body }
            hold_later_append(f)
            local lookups = f.marker_lookups
            local out, err = pipeline.run(c)
            test.is_nil(out)
            test.eq(assert(err):details().code, "projection_behind")
            test.eq(f.marker_lookups, lookups)
        end)

        test.it("answers without appending when the attempt has no events", function()
            local f = fake()
            local out = assert(pipeline.run(command(f, function(last_seq: integer): (pipeline.Attempt?, error?)
                return { result = { outcome = "unchanged" }, events = {}, as_of = last_seq, catalog_seq = last_seq }, nil
            end))) :: { [string]: unknown }
            test.eq(out.as_of, 10)
            test.is_nil(out.seq)
            test.eq(#f.appended, 0)
        end)

        test.it("rebuilds after a lost head or subject race", function()
            local f = fake()
            f.conflicts = { "head_mismatch", "version_mismatch" }
            local builds = 0
            local out, err = pipeline.run(command(f, function(last_seq: integer): (pipeline.Attempt?, error?)
                builds = builds + 1
                return one_event(last_seq)
            end))
            test.is_nil(err)
            test.not_nil(out)
            test.eq(builds, 3)
        end)

        test.it("surfaces other append conflicts and build errors unchanged", function()
            local f = fake()
            f.conflicts = { "something_else" }
            local _, err = pipeline.run(command(f, one_event))
            test.not_nil(err)
            test.eq((err :: error):kind(), errors.CONFLICT)
            local _, berr = pipeline.run(command(fake(), function(_s: integer): (pipeline.Attempt?, error?)
                return nil, errors.new({ kind = errors.INVALID, message = "no" })
            end))
            test.eq((berr :: error):kind(), errors.INVALID)
        end)

        test.it("answers busy when the race outlasts the deadline", function()
            local f = fake()
            for i = 1, 100000 do f.conflicts[i] = "head_mismatch" end
            local _, err = pipeline.run(command(f, one_event))
            test.not_nil(err)
            test.eq((err :: error):kind(), errors.UNAVAILABLE)
            test.eq(((err :: error):details() or {}).code, "busy")
        end)

        test.it("answers unavailable when the projection misses the deadline", function()
            local f = fake()
            f.done = false
            local _, err = pipeline.run(command(f, one_event))
            test.eq((err :: error):kind(), errors.UNAVAILABLE)
            test.is_true((err :: error):retryable() == true)
        end)

        test.it("answers unavailable after a durable append the projection does not reach, and replays the retry", function()
            local f = fake()
            local base = f.append_events
            f.append_events = function(self: Fake, r: { [string]: unknown }): (unknown, error?)
                local out, err = base(self, r)
                local events = r.events :: { types.Event }
                f.markers["r:1:n1:k2:u1"] = { seq = self.last_seq, body = events[1].body }
                self.done = false
                return out, err
            end
            local c = command(f, one_event, { deadline_ms = 50, fingerprint = { op = "x" }, idempotency = { namespace = "n", key = "k" } })
            local _, err = pipeline.run(c)
            test.not_nil(err)
            test.eq((err :: error):kind(), errors.UNAVAILABLE)
            test.is_true((err :: error):retryable())
            test.eq(#f.appended, 1)
            f.done = true
            local out, rerr = pipeline.run(c)
            test.is_nil(rerr)
            test.is_true((out :: Map).replayed)
            test.eq(#f.appended, 1)
        end)

        test.it("answers unavailable when a replay's projection misses the deadline", function()
            local f = fake()
            local c = command(f, one_event, { deadline_ms = 50, fingerprint = { op = "x" }, idempotency = { namespace = "n", key = "k" } })
            assert(pipeline.run(c))
            f.markers["r:1:n1:k2:u1"] = { seq = f.last_seq, body = (f.appended[1].events[1]).body }
            f.done = false
            local _, err = pipeline.run(c)
            test.not_nil(err)
            test.eq((err :: error):kind(), errors.UNAVAILABLE)
            test.eq(#f.appended, 1)
        end)

        test.it("waits for every event when the receipt appears during catch-up", function()
            local f = fake()
            local c = command(f, one_event, { idempotency = { namespace = "ns", key = "partial" } })
            assert(pipeline.run(c))
            local body = f.appended[1].events[1].body :: Map
            body.receipt.event_count = 3
            local external = assert(f.appended[1].events[1].external)
            f.markers[external.external_id] = { seq = 11, body = body }
            c.receipt = function(marker)
                f.done = false
                return f.receipt(marker)
            end
            local out, err = pipeline.run(c)
            test.is_nil(out)
            test.eq(assert(err):details().code, "projection_behind")
            test.eq(#f.appended, 1)
        end)

        test.it("marks every event of an idempotent command and stores the receipt on the first", function()
            local f = fake()
            local out = assert(pipeline.run(command(f, function(last_seq: integer): (pipeline.Attempt?, error?)
                return { result = { outcome = "done" }, events = { event("app:a", {}), event("app:b", {}) },
                    expect = { head = last_seq }, as_of = last_seq, catalog_seq = last_seq }, nil
            end, { idempotency = { namespace = "ns", key = "k" } }))) :: { [string]: unknown }
            test.eq(out.outcome, "done")
            local sent = f.appended[1].events
            test.eq((sent[1].external :: types.External).external_id, "r:2:ns1:k2:u1")
            test.eq((sent[1].external :: types.External).external_source, "app")
            test.eq((sent[2].external :: types.External).external_id, "e:13:r:2:ns1:k2:u1:2")
            local receipt = (sent[1].body :: { [string]: unknown }).receipt :: { [string]: unknown }
            test.not_nil(receipt.request_hash)
            test.eq((receipt.result :: { [string]: unknown }).outcome, "done")
            test.is_nil((sent[2].body :: { [string]: unknown }).receipt)
        end)

        test.it("includes the authenticated actor in the receipt marker and hash", function()
            local f = fake()
            for _, actor in ipairs({ "u1", "u2" }) do
                assert(pipeline.run(command(f, one_event, { actor = actor, idempotency = { namespace = "ns", key = "k" } })))
            end
            local first = f.appended[1].events[1]
            local second = f.appended[2].events[1]
            test.is_true(assert(first.external).external_id ~= assert(second.external).external_id)
            test.is_true((first.body :: Map).receipt.request_hash ~= (second.body :: Map).receipt.request_hash)
        end)

        test.it("replays the winner's receipt after losing a race on the same key", function()
            local f = fake()
            local first = assert(pipeline.run(command(f, one_event, { idempotency = { namespace = "ns", key = "k" } })))
            test.not_nil(first)
            local winner = f.appended[1].events[1].body
            f.conflicts = { "head_mismatch" }
            local builds = 0
            local out = assert(pipeline.run(command(f, function(s: integer): (pipeline.Attempt?, error?)
                builds = builds + 1
                f.markers["r:2:ns2:k22:u1"] = { seq = 11, body = { receipt = { request_hash = (winner :: Map).receipt.request_hash, result = { outcome = "winner" }, event_count = 1 } } }
                hold_later_append(f)
                return one_event(s)
            end, { idempotency = { namespace = "ns", key = "k2" } }))) :: Map
            test.eq(out.outcome, "winner")
            test.is_true(out.replayed == true)
            test.eq(builds, 1)
        end)

        test.it("replays a receipt that appears while an attempt finds nothing to do", function()
            local f = fake()
            local probe = assert(pipeline.run(command(f, one_event, { idempotency = { namespace = "ns", key = "p" } })))
            test.not_nil(probe)
            local hash = ((f.appended[1].events[1].body :: Map).receipt :: Map).request_hash
            local out = assert(pipeline.run(command(f, function(s: integer): (pipeline.Attempt?, error?)
                f.markers["r:2:ns2:k32:u1"] = { seq = 11, body = { receipt = { request_hash = hash, result = { outcome = "winner" }, event_count = 1 } } }
                return { result = { outcome = "unchanged" }, events = {}, as_of = s, catalog_seq = s }, nil
            end, { idempotency = { namespace = "ns", key = "k3" } }))) :: Map
            test.eq(out.outcome, "winner")
            test.is_true(out.replayed == true)
        end)

        test.it("replays the winner before recording a concurrent successful noop", function()
            local f = fake()
            assert(pipeline.run(command(f, one_event, { idempotency = { namespace = "ns", key = "probe" } })))
            local hashed = ((f.appended[1].events[1].body :: Map).receipt :: Map).request_hash
            local out = assert(pipeline.run(command(f, function(s: integer): (pipeline.Attempt?, error?)
                f.markers["r:2:ns4:race2:u1"] = { seq = 11, body = { receipt = { request_hash = hashed,
                    result = { outcomes = {{outcome="updated"}} }, event_count = 1 } } }
                return { result = { outcomes = {{outcome="unchanged"}} }, events = {}, expect={head=s}, as_of=s, catalog_seq=s }, nil
            end, { idempotency = { namespace = "ns", key = "race" },
                thread={id="t1",kind="app:model",source="app"} }))) :: Map
            test.eq(out.outcomes[1].outcome,"updated")
            test.is_true(out.replayed)
            test.eq(#f.appended,1)
        end)

        test.it("keeps the guard the attempt names", function()
            local f = fake()
            assert(pipeline.run(command(f, function(s: integer): (pipeline.Attempt?, error?)
                return { result = {}, events = { event("app:a", {}) }, expect = { subject = "i:1", version = 3 },
                    as_of = s, catalog_seq = s }, nil
            end)))
            local sent = f.appended[1].expect :: Map
            test.eq(sent.subject, "i:1")
            test.eq(sent.version, 3)
            test.is_nil(sent.head)
        end)

        test.it("appends without a guard when the attempt names none", function()
            local f = fake()
            assert(pipeline.run(command(f, function(s: integer): (pipeline.Attempt?, error?)
                return { result = {}, events = { event("app:a", {}) }, as_of = s, catalog_seq = s }, nil
            end)))
            test.is_nil(f.appended[1].expect)
        end)

        test.it("reports a stored receipt without a result", function()
            local f = fake()
            assert(pipeline.run(command(f, one_event, { idempotency = { namespace = "ns", key = "p" } })))
            local hash = ((f.appended[1].events[1].body :: Map).receipt :: Map).request_hash
            f.markers["r:2:ns6:broken2:u1"] = { seq = 3, body = { receipt = { request_hash = hash } } }
            local _, err = pipeline.run(command(f, one_event, { idempotency = { namespace = "ns", key = "broken" } }))
            test.eq((err :: error):kind(), errors.INTERNAL)
        end)

        test.it("refuses a receipt whose final append position cannot be reconstructed", function()
            local f = fake()
            local c = command(f, one_event, { idempotency = { namespace = "ns", key = "position" } })
            assert(pipeline.run(c))
            local body = f.appended[1].events[1].body :: Map
            body.receipt.event_count = nil
            local external = f.appended[1].events[1].external :: types.External
            f.markers[external.external_id] = { seq = 11, body = body }
            local out, err = pipeline.run(c)
            test.is_nil(out)
            test.eq((err :: error):kind(), errors.INTERNAL)
            test.eq((err :: error):details().code, "row_corrupt")
        end)

        test.it("refuses a stored receipt without a matching request hash", function()
            local f = fake()
            f.markers["r:2:ns5:plain2:u1"] = { seq = 3, body = {} }
            local _, err = pipeline.run(command(f, one_event, { idempotency = { namespace = "ns", key = "plain" } }))
            test.eq(((err :: error):details() or {}).code, "idempotency_conflict")
        end)

        test.it("hashes a request the same whatever its key order", function()
            local f = fake()
            assert(pipeline.run(command(f, one_event, { idempotency = { namespace = "ns", key = "o" }, fingerprint = { a = 1, b = 2 } })))
            local body = f.appended[1].events[1].body
            f.markers["r:2:ns1:o2:u1"] = { seq = 11, body = body }
            local again = assert(pipeline.run(command(f, one_event, { idempotency = { namespace = "ns", key = "o" }, fingerprint = { b = 2, a = 1 } }))) :: Map
            test.is_true(again.replayed == true)
        end)

        test.it("replays a stored receipt and refuses the key for another request", function()
            local f = fake()
            local first = assert(pipeline.run(command(f, one_event, { idempotency = { namespace = "ns", key = "k" } })))
            test.not_nil(first)
            local sent = f.appended[1].events[1]
            f.markers["r:2:ns1:k2:u1"] = { seq = 11, body = sent.body }
            local builds = 0
            local again = assert(pipeline.run(command(f, function(s: integer): (pipeline.Attempt?, error?)
                builds = builds + 1
                return one_event(s)
            end, { idempotency = { namespace = "ns", key = "k" } }))) :: { [string]: unknown }
            test.is_true(again.replayed == true)
            test.eq(again.seq, 11)
            test.eq(builds, 0)
            local _, conflict = pipeline.run(command(f, one_event, { idempotency = { namespace = "ns", key = "k" }, fingerprint = { op = "y" } }))
            test.eq((conflict :: error):kind(), errors.CONFLICT)
            test.eq(((conflict :: error):details() or {}).code, "idempotency_conflict")
            local _, empty = pipeline.run(command(f, one_event, { idempotency = { namespace = "", key = "k" } }))
            test.eq((empty :: error):kind(), errors.INVALID)
        end)
    end)
end

return { run = test.run_cases(define) }
