-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local channel = require("channel")
local contract = require("contract")
local ctx = require("ctx")
local events = require("events")
local registry = require("registry")
local time = require("time")

local CONTRACT = "kickside.core:threads"
local REAL = "kickside.core:threads_binding"
local FIXTURE = "app.mail_library:threads_fault_binding"
local METHODS = "app.mail_library:threads_fixture_"
local M = {}

function M.select()
    local real = assert(registry.get(REAL))
    local original = assert(registry.get(REAL))
    local definition = real.data.contracts[1]
    assert(definition.contract == CONTRACT and definition.default)
    definition.default = false
    local methods = {}
    for name, id in pairs(definition.methods) do methods[name] = id end
    methods.find = METHODS .. "find"
    methods.append_events = METHODS .. "append"
    methods.list_events = METHODS .. "list"
    methods.prune_boundary = METHODS .. "boundary"
    local changes = assert(registry.snapshot()):changes()
    assert(changes:update(real))
    assert(changes:create({id = FIXTURE, kind = "contract.binding", meta = {}, data = {
        contracts = {{contract = CONTRACT, default = true, methods = methods}},
    }}))
    assert(changes:apply())
    return function()
        local restore = assert(registry.snapshot()):changes()
        assert(restore:delete(FIXTURE))
        assert(restore:update(original))
        assert(restore:apply())
    end
end

local function real()
    return assert(assert(contract.get(CONTRACT)):open(REAL))
end

local SYSTEM = "mail.fixture.threads"

local function receive(subscription, message)
    local inbox = subscription:channel()
    local timeout = assert(time.after("8s"))
    local wake = channel.select({inbox:case_receive(), timeout:case_receive()})
    subscription:close()
    assert(wake.channel == inbox, message)
end

function M.pause(gate)
    local resume = assert(events.subscribe(SYSTEM, gate .. ".resume"))
    assert(events.send(SYSTEM, gate .. ".paused", gate))
    receive(resume, "Threads fixture was not released")
end

function M.observe_pause(gate)
    local paused = assert(events.subscribe(SYSTEM, gate .. ".paused"))
    return function() receive(paused, "Threads fixture did not pause") end
end

function M.resume(gate)
    assert(events.send(SYSTEM, gate .. ".resume", gate))
end

function M.append(input)
    local fault = ctx.get("mail_fixture_threads")
    if fault and fault.append == "lost" and input.events[1].type == "kickside.mail.events:asset.restored" then
        return nil, errors.new({kind = errors.UNAVAILABLE, retryable = true,
            message = "Threads did not acknowledge the append",
            details = {code = "fixture_lost_append", cause = {kind = errors.UNAVAILABLE}}})
    end
    if fault and fault.append == "pause" then M.pause(fault.gate) end
    return real():append_events(input)
end

function M.find(input)
    local fault = ctx.get("mail_fixture_threads")
    if fault and fault.subject and fault.subject == input.subject then M.pause(fault.gate) end
    return real():find(input)
end

function M.list(input)
    local page, err = real():list_events(input)
    local fault = ctx.get("mail_fixture_threads")
    if not err and fault and fault.source_seq ~= nil and fault.source_seq == input.from_seq then M.pause(fault.gate) end
    return page, err
end

function M.boundary(input)
    local fault = ctx.get("mail_fixture_threads")
    if fault and fault.missing_boundary then
        return nil, errors.new({kind = errors.NOT_FOUND, message = "Threads fixture has no prune boundary"})
    end
    if fault and fault.pruned then return {max_pruned_seq = fault.pruned}, nil end
    return real():prune_boundary(input)
end

return M
