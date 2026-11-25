-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local activity = require("activity")
local catalog = require("catalog")
local delivery = require("delivery")
local preview = require("preview")
local send = require("send")

return {
    send = send.send,
    resend = send.resend,
    get_message = activity.get,
    list_messages = activity.list,
    list_templates = catalog.list_templates,
    get_template = catalog.get_template,
    preview = preview.preview,
    delivery_status = delivery.status,
    send_delivery_test = send.delivery_send_test,
    library_send_test = send.library_send_test,
}
