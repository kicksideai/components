-- SPDX-License-Identifier: LicenseRef-KickSide-Community-1.0
local delivery_wait = require("delivery_wait")
local http = require("http_client")
local json = require("json")
local sql = require("sql")
local system = require("system")
local time = require("time")
local uuid = require("uuid")
local test = require("test")
local library_fixtures = require("library_fixtures")
local fixtures = require("fixtures")
local session = fixtures.session
local settings = fixtures.settings
local access_cases = require("access_cases")
local library_cases = require("library_cases")
local image_cases = require("image_cases")
local draft_cases = require("draft_cases")
local delivery_cases = require("delivery_cases")

local API = "/api/mail"
local ZERO = "00000000-0000-0000-0000-000000000000"

local function request(who, method, path, payload, headers, prefix)
    local state = assert(system.supervisor.state("app:gateway"))
    local address = assert(state.details:match("^service listening on (127%.0%.0%.1:[1-9]%d*)$"), state.details)
    headers = headers or {}
    headers["Content-Type"] = "application/json"
    if who then headers.Authorization = "Bearer " .. who.token end
    local res = assert(http.request(method, "http://" .. address .. (prefix or API) .. path, {
        headers = headers, body = payload and assert(json.encode(payload)) or nil,
    }))
    return res.status_code, res.body ~= "" and json.decode(res.body) or nil, res.body, res.headers
end

local function data(who, method, path, payload, expected)
    local status, body, raw = request(who, method, path, payload)
    assert(status == (expected or 200), method .. " " .. path .. " returned " .. status .. ": " .. raw)
    test.is_true(body.success, raw)
    return body.data
end

local function review(who, message, edit)
    edit.message = message
    local result = data(who, "POST", "/library/preview", edit)
    return assert(result.preview_id, result.errors[1] and result.errors[1].message)
end

local function create(who, item)
    item.preview_id = review(who, item.kind == "message" and item.name or "notice", {create = item})
    local saved = data(who, "POST", "/library", item, 201)
    library_fixtures.await_live(saved.seq)
    return saved
end

local function update(who, item, message)
    item.preview_id = review(who, message or (item.kind == "message" and item.name or "notice"), {resources = {item}})
    local saved = data(who, "PUT", "/library/" .. item.kind .. "/" .. item.name, item)
    library_fixtures.await_live(saved.seq)
    return saved
end

local function revision_write(who, operation, item, fields, message)
    fields.kind, fields.name = item.kind, item.name
    fields.expected_revision = item.revision
    local route = "/library/" .. item.kind .. "/" .. item.name .. "/" .. operation
    local draft = {[operation == "base" and "set_base" or operation] = fields}
    fields.preview_id = review(who, message or (item.kind == "message" and item.name or "notice"), draft)
    local saved = data(who, "POST", route, fields)
    library_fixtures.await_live(saved.seq)
    return saved
end

local function await_delivery(who, id)
    local entry = delivery_wait.terminal(function()
        return data(who, "GET", "/activity/" .. id)
    end, "10s")
    test.eq("sent", entry.status)
    return entry
end

local function fixture(kind, name, content)
    local result = {kind = kind, name = name, title = name, description = "", html = content, text = content,
        schema = {type = "object", properties = {}}, samples = {}}
    return result
end

return {run = test.run_cases(function()
    test.describe("Mail HTTP", function()
        local state = {}
        test.before_each(function()
            state.owned, state.activity_rows, state.activity_sender, state.configured = {}, {}, nil, false
        end)
        local function own(item)
            state.owned[#state.owned + 1] = {kind = item.kind, name = item.name}
            return item
        end
        local function configure()
            state.configured = true
            settings("app.mail_harness:capture", "mail@example.org")
        end
        local function failed(sender, subject, recipient, at, template)
            local id = uuid.v4()
            state.activity_rows[#state.activity_rows + 1] = id
            local now = at or time.now():unix_nano() // 1000000
            local db = assert(sql.get("app:db"))
            assert(db:execute([[INSERT INTO mail_message
                (id,created_at,finished_at,sender,recipients,subject,from_address,attachments,driver_id,
                error_kind,error_code,error_message,provider_detail,failed_html,failed_text,template,status,sent_at)
                VALUES ($1,$2,$2,$3,$4,$5,'mail@example.org','[]','fixture',
                'PERMISSION_DENIED','credentials_invalid','Provider authorization refused','Provider response',
                '<p>Saved content</p>','Saved content',$6,$7,$8)]],
                {id, now, sender, assert(json.encode({to = {recipient}})), subject, template or sql.NULL, template and "sent" or "failed", template and now or sql.NULL}))
            assert(db:release())
            return id
        end
        test.after_each(function()
            library_fixtures.remove(state.owned)
            if #state.activity_rows > 0 or state.activity_sender then
                local db = assert(sql.get("app:db"))
                if state.activity_sender then
                    assert(db:execute("DELETE FROM mail_message WHERE sender=$1", {state.activity_sender}))
                end
                for _, id in ipairs(state.activity_rows) do
                    assert(db:execute("DELETE FROM mail_message WHERE id=$1", {id}))
                end
                assert(db:release())
            end
            if state.configured then settings("", "") end
        end)

        local cases = {
            test = test,
            session = session,
            request = request,
            data = data,
            create = create,
            update = update,
            await_delivery = await_delivery,
            fixture = fixture,
            own = own,
            configure = configure,
            state = state,
            ZERO = ZERO,
            review = review,
            revision_write = revision_write,
            failed = failed,
            settings = settings,
        }
        access_cases.register(cases)
        library_cases.register(cases)
        image_cases.register(cases)
        draft_cases.register(cases)
        delivery_cases.register(cases)

    end)
end)}
