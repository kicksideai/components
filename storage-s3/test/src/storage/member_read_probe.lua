local adapter = require("adapter")
return { run = function(args)
    local storage = assert(adapter.get("app:uploads"))
    local content, err = storage:readfile(args.path)
    return {content = content, denied = errors.is(err, errors.PERMISSION_DENIED), error = tostring(err)}
end }
