local state = require("state")

local function read(args)
    local thread_id, resolve_err = state.resolve_thread_id(args.research_id)
    if resolve_err then return nil, resolve_err end
    local run, get_err = state.get(args.research_id)
    if get_err then return nil, get_err end
    local summary, summary_err = state.summary(args.thread_id)
    if summary_err then return nil, summary_err end
    local rows, list_err, next_offset = state.list(args.limit or 200, args.offset or 0)
    if list_err then return nil, list_err end
    return { thread_id = thread_id, run = run, summary = summary, rows = rows, next_offset = next_offset }
end

return { read = read }
