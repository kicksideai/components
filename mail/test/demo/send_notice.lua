-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local security = require("security")
local client = require("client")
local contract = require("contract")
local uploads = require("uploads")
local time = require("time")

local function send(files)
    local settings = assert(assert(contract.get("kickside.settings:settings")):open())
    for key, value in pairs({driver = "render-demo", from_address = "reports@example.org", from_name = "KickSide"}) do
        local result = assert(settings:set({namespace = "kickside.mail", key = key, value = value}))
        assert(result.success, result.error :: string?)
    end

    local actor = assert(security.actor())
    local function store(filename, content_type)
        local bytes = files[filename]
        return assert(uploads.store_file(actor:id(), bytes, filename, #bytes, content_type)).uuid
    end

    local queued = assert(client.send({
        to = {"reader@example.org"},
        template = "notice",
        vars = {
            subject = "Your workspace activity report is ready",
            preheader = "See the weekly activity summary and open the attached PDF.",
            heading = "Your weekly report is ready",
            message = "Your workspace activity report for November 16–22 is ready. It brings together the week’s completed work and activity trends.",
            paragraphs = {
                "Open the online report to explore the activity by day, or share the attached PDF with your team.",
            },
            action_url = "https://example.org/reports/weekly?period=2026-11-16",
            action_label = "Open the report",
            inline_content_id = "weekly-activity",
            image_alt = "Weekly activity chart beside a Report ready checkmark",
            details = {
                {key = "Reporting period", value = "November 16–22, 2026"},
                {key = "Report status", value = "Ready to share"},
                {key = "Attachment", value = "report.pdf"},
            },
        },
        attachments = {
            {upload_id = store("activity-banner.png", "image/png"), disposition = "inline", content_id = "weekly-activity"},
            {upload_id = store("report.pdf", "application/pdf")},
        },
    }))
    local deadline = time.now():add(25 * time.SECOND):unix_nano()
    repeat
        local entry = assert(client.get_message(queued.message_id))
        if entry.status == "sent" then return entry end
        if entry.status == "failed" then error(entry.last_error.message) end
        time.sleep("25ms")
    until time.now():unix_nano() >= deadline
    error("Demo message did not reach a terminal state")
end

return {send = send}
