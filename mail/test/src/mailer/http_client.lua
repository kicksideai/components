-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local json = require("json")

local failures = {
    refused = "dial tcp: connect: connection refused",
    dns = "lookup provider.example.org: no such host",
    tls = "tls: failed to verify certificate",
    connect_timeout = "dial tcp: i/o timeout",
    response_timeout = "context deadline exceeded (Client.Timeout exceeded while awaiting headers)",
    response_reset = "read tcp: connection reset by peer",
}

return {
    request = function(method, url, options)
        assert(method == "POST" and url == "https://provider.example.org/messages")
        local input = assert(json.decode(options.body))
        if input.fault == "denied" then
            return nil, errors.new({kind = errors.PERMISSION_DENIED, retryable = false,
                message = "not allowed", details = {url = url}})
        end
        local message = assert(failures[input.fault])
        if input.attempts == 1 then
            return nil, errors.new({kind = errors.INTERNAL, retryable = true, message = message})
        end
        return {status_code = 200, body = '{"id":"fixture-http-delivery"}', headers = {}}, nil
    end,
}
