-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local http = require("http")
local handlers = require("handlers")
return {run = function(args)
    http.reset()
    if args.configure then handlers.configure() else handlers.handle() end
    return {status = http.status, body = http.body}
end}
