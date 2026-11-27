-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local contract = require("contract")
local json = require("json")
local registry = require("registry")
local security = require("security")

local SETTINGS = "example.mail.relay"
local BINDING = SETTINGS .. ":transport"

local function register(support)
    local test, actors = support.test, support.actors
    test.it("admits only the configured example relay URL in its HTTP policy", function()
        local policy = assert(security.policy(SETTINGS .. ".security:http_access"))
        local scope = assert(security.new_scope({policy}))
        local actor = assert(security.actor())
        local url = assert(registry.get(SETTINGS .. ":endpoints")).data.endpoints.api
        test.not_nil(url:match("^https://127%.0%.0%.1:[1-9]%d*/messages$"))
        test.eq("allow", scope:evaluate(actor, "http_client.request", url))
        test.neq("allow", scope:evaluate(actor, "http_client.request", (url:gsub("/messages$", "/unlisted"))))
    end)

    test.it("runs the authoring example through Mail and Settings", function()
        local admin, sender = actors.admin, actors.sender
        local manager = support.caller({"kickside.mail.security:driver_admin"})
        local settings = assert(assert(contract.get("kickside.settings:settings")):open())
        local function status()
            local delivery = assert(support.invoke(manager, "delivery_status"))
            for _, transport in ipairs(delivery.transports) do
                if transport.id == BINDING then return transport end
            end
            error("Example Relay is absent from the Mail catalog")
        end
        local unconfigured = status()
        test.is_false(unconfigured.ready)
        test.eq("api_key_required", unconfigured.code)

        assert(settings:set({namespace = SETTINGS, key = "api_key", value = "example-fixture-only"}).success)
        local changed = support.change(admin, "driver", BINDING)
        assert(changed.success, changed.error)
        assert(support.change(admin, "from_address", "mail@example.org").success)
        local ready = status()
        test.is_true(ready.ready)
        test.eq(SETTINGS, ready.settings_ns)
        test.is_false(ready.idempotent)

        local accepted = assert(support.invoke(sender, "send", support.template_request()))
        local sent = support.terminal(actors.log_admin, accepted)
        test.eq("sent", sent.status)
        local wire = assert(json.decode(sent.provider_message_id))
        test.eq("Status & updates", wire.subject)
        test.eq("mail-library-logo", wire.content_id)
        test.is_true(wire.encoded_attachment)

        local message = support.body()
        message.subject = "Rejected by the relay"
        local rejected = assert(support.invoke(sender, "send", message))
        local failed = support.terminal(actors.log_admin, rejected)
        test.eq("failed", failed.status)
        test.eq("message_rejected", failed.last_error.code)
        test.eq(1, failed.attempts)

        assert(settings:unset({namespace = SETTINGS, key = "api_key"}).success)
    end)
end

return {register = register}
