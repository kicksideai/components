-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local capacity = require("capacity")
local capacity_reads = require("capacity_reads")
local edits = require("edits")
local reference = require("reference")
local schemas = require("schemas")
local shape = require("shape")
local work = require("work")

type Handler = (unknown) -> (unknown, error?)

local function validated(method: string, handler: Handler): Handler
    return function(input: unknown): (unknown, error?)
        local err = shape.check(schemas[method].input :: work.JsonObject, input, "Planning " .. method .. " request")
        if err then return nil, err end
        return handler(input)
    end
end

local function roadmap(input: { board_id: string }): (unknown, error?)
    local types, err = capacity_reads.roadmap(input.board_id)
    if not types then return nil, err end
    return { types = types }, nil
end

return {
    plan_sprint = validated("plan_sprint", edits.plan_sprint :: Handler),
    move_dates = validated("move_dates", edits.move_dates :: Handler),
    check_capacity = validated("check_capacity", capacity_reads.check_capacity :: Handler),
    set_capacity = validated("set_capacity", capacity.set_capacity :: Handler),
    workload = validated("workload", capacity_reads.workload :: Handler),
    roadmap = validated("roadmap", roadmap :: Handler),
    resolve = validated("resolve", reference.resolve :: Handler),
    report = validated("report", reference.report :: Handler),
}
